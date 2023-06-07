from keras.callbacks import ModelCheckpoint
# adaptive moment estimation, a type of stochastic gradient descent
from keras.optimizers import Adam
from keras.models import Sequential, load_model
from keras.layers import Flatten
from keras.layers import Conv2D
from keras.layers import Reshape
from keras.layers import Dense
from skimage.measure import block_reduce
import keras
import numpy as np
import gym
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from pong_env2 import PongEnv
import time


def prepro(I):
    """ prepro (480x640x3) uint8 frame into (60x80) and then into 1D float vector """

    downsample = 10

    # downsample by factor of 8.

    # first, change to 0-1
    I = block_reduce(I, (downsample, downsample),
                     np.mean)

    I = 1.0 * (I > 0)
    # everything else (paddles, ball) just set to 1. this makes the image grayscale effectively
    # ravel flattens an array and collapses it into a column vector
    return I.ravel()


def show_preprocess(env):  # method for testing preprocessing method

    shape = (48, 64)
    o1 = env.reset()
    o1_processed = prepro(o1).ravel()
    for i in range(15):
        o2, _, _, _ = env.step(1)

    o2_processed = prepro(o2).ravel()

    diff = (o2_processed-o1_processed).reshape(shape)

    plt.subplot(1, 5, 1)
    plt.imshow(o1)
    plt.title('o1')

    plt.subplot(1, 5, 2)
    plt.imshow(o2)
    plt.title('o2')

    plt.subplot(1, 5, 3)
    plt.imshow(o1_processed.reshape(shape))
    plt.title('o1 pp')

    plt.subplot(1, 5, 4)
    plt.imshow(o2_processed.reshape(shape))
    plt.title('o2 pp')

    plt.subplot(1, 5, 5)
    plt.imshow(diff)
    plt.title('diff')

    plt.imshow(diff)
    plt.title('Difference Image')

    plt.tight_layout()
    plt.show()


def discount_rewards(r, gamma):  # idea
    r = np.array(r)
    discounted_r = np.zeros(r.shape)
    running_add = 0

    for t in reversed(range(0, len(r))):

        if r[t] != 0:
            running_add = 0  # if the game ended reset
        running_add = running_add * gamma + r[t]
        discounted_r[t] = running_add

    # not sure whether normalizing is helpful or not:

    # discounted_r -= np.mean(discounted_r)
    # discounted_r /= np.std(discounted_r)

    return discounted_r


def get_model():
    model = Sequential()
    model.add(Dense(units=200,
                    input_dim=48*64,
                    activation='relu',
                    kernel_initializer='glorot_uniform'))

    model.add(Dense(units=1,
                    activation='sigmoid',
                    kernel_initializer='RandomNormal'))

    model.compile(loss='binary_crossentropy',
                  optimizer='adam', metrics=['accuracy'])

    return model


def train():
    # gym initialization

    env = PongEnv()
    observation = env.reset()
    prev_input = None

    # show_preprocess(env)
    # Declaring the two actions that can happen in Pong for an agent, move up or move down
    # Decalring 0 means staying still. Note that this is pre-defined specific to package.
    UP_ACTION = 1
    DOWN_ACTION = 2
    # Hyperparameters. Gamma here allows you to measure the effect of future events
    gamma = 0.99
    # initialization of variables used in the main loop
    x_train, y_train, rewards = [], [], []
    reward_sum = 0
    episode_num = 0

    history = []
    observation = env.reset()  # initialize to first frame
    prev_input = None

    model = get_model()
    filepath = 'model.h5'
    # model = load_model(filepath)

    checkpoint = ModelCheckpoint(filepath, monitor='loss', verbose=1)
    callbacks_list = [checkpoint]

    num_games = 0
    frame_count = 0
    wins = 0

    # fig, ax = plt.subplots()
    # ims = []
    while (True):
        start = time.process_time()

        episode_done = False

        cur_input = prepro(observation)  # frame preprocessed

        x = cur_input - \
            prev_input if prev_input is not None else np.zeros(48 * 64)

        prev_input = cur_input

        x = np.expand_dims(x, axis=1).T

        end = time.process_time()
        obs_time = end - start

        start = time.process_time()
        prob = model.predict(x, verbose=False)
        end = time.process_time()
        model_pred = end-start
        # The neural net returns a probability
        action = UP_ACTION if np.random.uniform() < prob else DOWN_ACTION

        # converting between output of neural net and up/down action
        y = 1 if action == 2 else 0

        x_train.append(x)
        y_train.append(y)
        start = time.process_time()
        observation, reward, done, info = env.step(action)
        if reward == 1:
            wins += 1

        # if frame_count == 0:
        #     im = plt.imshow(observation)
        # else:
        #     im = plt.imshow(observation, animated=True)
        # ims.append([im])

        rewards.append(reward)
        frame_count += 1
        end = time.process_time()

        if done:
            prev_input = None
            observation = env.reset()
            num_games += 1
            print(num_games, frame_count, reward, end="\r")

            # ani = animation.ArtistAnimation(fig, ims, interval=50, blit=True,
            #                                 repeat_delay=1000)
            plt.show()
            if num_games == 21:
                episode_done = True
                num_games = 0

        if episode_done:  # episode finished after 21 games are won by either player
            reward_sum = np.sum(rewards)
            history.append(reward_sum)
            print("Episode Number: ", episode_num, "| Total Reward: ",
                  reward_sum, " | AVG Frames: ", frame_count / 21, "wins:", wins)
            frame_count = 0
            wins = 0
            # x: image arrays, y=action performed, weights:

            disc = discount_rewards(rewards, gamma)
            print(disc)

            model.fit(x=np.vstack(x_train),
                      y=np.vstack(y_train),
                      sample_weight=disc,
                      verbose=0, callbacks=callbacks_list)

            x_train, y_train, rewards = [], [], []
            observation = env.reset()

            episode_num += 1
            prev_input = None
# stuff to run always here such as class/def


def main():
    train()


if __name__ == "__main__":
    # stuff only to run when not called via 'import' here
    main()
