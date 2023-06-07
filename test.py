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
import matplotlib.animation as animation
import matplotlib.pyplot as plt
from pong_env2 import PongEnv
from pong import prepro


env = PongEnv()
observation = env.reset()

UP_ACTION = 1
DOWN_ACTION = 2


filepath = 'model.h5'
model = load_model(filepath)

fig, ax = plt.subplots()
ims = []

frame_count = 0
done = False
prev_input = None
rewards = []
finished = False
while not done:
    cur_input = prepro(observation)  # frame preprocessed

    x = cur_input - prev_input if prev_input is not None else np.zeros(48 * 64)

    prev_input = cur_input

    x = np.expand_dims(x, axis=1).T
    prob = model.predict(x, verbose=False)
    # The neural net returns a probability
    action = UP_ACTION if np.random.uniform() < prob else DOWN_ACTION

    observation, reward, done, info = env.step(action)
    rewards.append(reward)

    if frame_count == 0:
        im = plt.imshow(observation)
    else:
        im = plt.imshow(observation, animated=True)
    ims.append([im])
    # if done:
    #     if 1 not in rewards:
    #         rewards = []
    #         ims = []
    #         observation = env.reset()
    #         prev_input = None
    #     else:
    #         break


ani = animation.ArtistAnimation(fig, ims, interval=200, blit=True,
                                repeat_delay=1000)
plt.show()
