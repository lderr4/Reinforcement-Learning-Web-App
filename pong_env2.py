import gym
from gym import spaces
import numpy as np
import sys
import skimage
import matplotlib.pyplot as plt


class PongCPU():

    def __init__(self, screen_width, screen_height, paddle_height, paddle_width, cpu_speed):
        offset = 25  # offset + paddle_width (10+15)
        self.paddle_pos = [screen_height // 2 -
                           paddle_height//2, screen_width-offset]
        self.paddle_height = paddle_height
        self.speed = cpu_speed

    def update(self, ball_y):
        # y coord of middle of paddle

        choice = np.random.rand()
        if choice >= 0.95:  # 5% to do nothing
            return
        y = self.paddle_pos[0] + self.paddle_height // 2

        if(y < ball_y - 10):  # ball is below
            self.paddle_pos[0] = int(self.paddle_pos[0] + self.speed)

        elif y > ball_y + 10:  # ball is above
            self.paddle_pos[0] = int(self.paddle_pos[0] - self.speed)
        return

    def get_pos(self):
        return self.paddle_pos


class PongEnv(gym.Env):
    def __init__(self):

        # Set up the Pygame window
        self.screen_width = 640
        self.screen_height = 480
        self.screen = np.zeros(shape=(self.screen_height, self.screen_width))

        # Define action and observation space
        # 0: Stay, 1: Move Up, 2: Move Down
        self.action_space = spaces.Discrete(3)
        self.observation_space = spaces.Box(low=0, high=255, shape=(
            self.screen_height, self.screen_width, 3), dtype=np.uint8)

        # Game variables
        self.ball_radius = 10
        self.paddle_width = 15
        self.paddle_height = 60
        self.paddle_speed = 25

        self.ball_pos = [self.screen_height // 2,
                         self.screen_width // 2]  # center of screen

        self.paddle_pos = [self.screen_height // 2 -
                           self.paddle_height // 2, 10]  # top right

        # random number between 2 and 4 in x and y direction
        self.ball_vel = np.random.uniform(80, 120, size=2).tolist()

        # cpu speed slightly slower than ball
        cpu_speed = 0.95 * self.ball_vel[0]

        self.cpu = PongCPU(self.screen_width, self.screen_height,
                           self.paddle_height, self.paddle_width, cpu_speed)

    def update_screen(self):
        dim = (self.screen_height, self.screen_width)
        extent = (self.paddle_height, self.paddle_width)

        paddle_x, paddle_y = skimage.draw.rectangle(
            start=self.paddle_pos, extent=extent, shape=dim)
        cpu_x, cpu_y = skimage.draw.rectangle(
            start=self.cpu.get_pos(), extent=extent, shape=dim)

        ball_x, ball_y = skimage.draw.ellipse(
            self.ball_pos[0], self.ball_pos[1], self.ball_radius, self.ball_radius, shape=dim)
        self.screen = np.zeros(shape=(self.screen_height, self.screen_width))

        self.screen[ball_x, ball_y] = 1
        self.screen[paddle_x, paddle_y] = 1
        self.screen[cpu_x, cpu_y] = 1
        return

    def reset(self):
        # Reset the game state

        self.ball_pos = [self.screen_height // 2, self.screen_width // 2]
        self.ball_vel = np.random.uniform(20, 30, size=2).tolist()
        self.paddle_pos = [self.screen_height // 2 -
                           self.paddle_height // 2, 10]  # top right
        cpu_speed = 0.95 * self.ball_vel[0]
        self.cpu = PongCPU(self.screen_width, self.screen_height,
                           self.paddle_height, self.paddle_width, cpu_speed)
        self.update_screen()
        return self.screen

    def step(self, action):

        # Perform the given action and return the new state, reward, and terminal flag
        reward = 0
        done = False

        # Update paddle position based on action
        if action == 1:  # Move Up
            self.paddle_pos[0] -= self.paddle_speed
        elif action == 2:  # Move Down
            self.paddle_pos[0] += self.paddle_speed

        # self.paddle_pos[1] = self.ball_pos[1]-30 # action aligns with ball perfectly

        # Update ball position
        self.ball_pos[0] += self.ball_vel[0]
        self.ball_pos[1] += self.ball_vel[1]

        self.cpu.update(self.ball_pos[0])
        cpu_pos = self.cpu.get_pos()

        # vertical collision
        if self.ball_pos[0] <= 0 + self.ball_radius or self.ball_pos[0] >= self.screen_height - self.ball_radius:
            self.ball_vel[0] = -self.ball_vel[0]

        # Check for collision with paddles
        if self.ball_pos[1] <= self.paddle_pos[1] + self.paddle_width and self.paddle_pos[0] <= self.ball_pos[0] <= self.paddle_pos[0] + self.paddle_height:
            self.ball_vel[1] = -self.ball_vel[1]

        if self.ball_pos[1] >= cpu_pos[1] and cpu_pos[0] <= self.ball_pos[0] <= cpu_pos[0] + self.paddle_height:
            self.ball_vel[1] = -self.ball_vel[1]

        # Check for ball out of bounds
        if self.ball_pos[1] <= 0:
            done = True
            reward = -1
        elif self.ball_pos[0] >= self.screen_width:
            done = True
            reward = 1
        self.update_screen()

        return self.screen, reward, done, {}  # 0 is screen
