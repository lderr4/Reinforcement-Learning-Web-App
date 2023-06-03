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
from pong_env2 import PongEnv


def prepro(I):
    """ prepro (480x640x3) uint8 frame into (60x80) and then into 1D float vector """

    print("start", I.shape)

    I = np.any(I != 0, axis=2)
    print(I.shape)
    downsample = 10

    new_height = 60
    new_width = 80
    # downsample by factor of 8.

    # first, change to 0-1
    I = block_reduce(I, (downsample, downsample),
                     np.mean)

    print(I.shape)
    I = 1.0 * (I > 0)
    # everything else (paddles, ball) just set to 1. this makes the image grayscale effectively
    print(I.shape)

    # ravel flattens an array and collapses it into a column vector
    return I


def show_preprocess(env):
    o1 = env.reset()
    o2, _, _, _ = env.step(1)
    plt.subplot(1, 3, 1)

    print("init", o1.shape, o2.shape, (o2-o1).shape)
    plt.imshow(o2-o1)
    plt.title('Difference Image')

    obs_preprocessed = prepro(o2-o1)
    print(obs_preprocessed.shape)
    print(np.unique(obs_preprocessed, return_counts=True))  # binary array
    plt.imshow(obs_preprocessed)
    plt.show()  # after preprocessing


def discount_rewards(r, gamma):  # idea
    r = np.array(r)
    discounted_r = np.zeros(r.shape)
    running_add = 0
    print(discounted_r)

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
                    input_dim=80*80,
                    activation='relu',
                    kernel_initializer='glorot_uniform'))

    model.add(Dense(units=1,
                    activation='sigmoid',
                    kernel_initializer='RandomNormal'))

    model.compile(loss='binary_crossentropy',
                  optimizer='adam', metrics=['accuracy'])

    filepath = 'dumb_model.h5'
    checkpoint = ModelCheckpoint(filepath, monitor='loss', verbose=1)
    callbacks_list = [checkpoint]

    model.summary()
    return model


# gym initialization

env = PongEnv()
observation = env.reset()
prev_input = None
# Declaring the two actions that can happen in Pong for an agent, move up or move down
# Decalring 0 means staying still. Note that this is pre-defined specific to package.
UP_ACTION = 2
DOWN_ACTION = 3
# Hyperparameters. Gamma here allows you to measure the effect of future events
gamma = 0.99
# initialization of variables used in the main loop
x_train, y_train, rewards = [], [], []
reward_sum = 0
episode_num = 0
print("aga")
show_preprocess(env)
print("aaaaffa")

# history = []
# observation = env.reset()  # initialize to first frame
# prev_input = None

# while (True):

#     cur_input = prepro(observation)  # frame preprocessed

#     x = cur_input - prev_input if prev_input is not None else np.zeros(80 * 80)

#     prev_input = cur_input

#     x = np.expand_dims(x, axis=1).T
#     prob = model.predict(x, verbose=False)

#     # The neural net returns a probability
#     action = UP_ACTION if np.random.uniform() < prob else DOWN_ACTION

#     # converting between output of neural net and up/down action
#     y = 1 if action == 2 else 0

#     x_train.append(x)
#     y_train.append(y)

#     observation, reward, done, info = env.step(action)

#     rewards.append(reward)

#     if done:  # episode finished after 21 games are won by either player
#         reward_sum = np.sum(rewards)
#         history.append(reward_sum)
#         print("Episode Number: ", episode_num, "| Total Reward: ", reward_sum)

#         # x: image arrays, y=action performed, weights:

#         disc = discount_rewards(rewards, gamma)
#         print(disc)

#         model.fit(x=np.vstack(x_train),
#                   y=np.vstack(y_train),
#                   sample_weight=disc,
#                   verbose=0, callbacks=callbacks_list)

#         x_train, y_train, rewards = [], [], []
#         observation = env.reset()

#         episode_num += 1
#         prev_input = None
