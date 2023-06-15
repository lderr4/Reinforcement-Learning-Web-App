import gym
from gym import spaces
import pygame
from pygame.locals import *
import numpy as np
import sys


class PongCPU():

    def __init__(self, screen_width, screen_height, paddle_height, cpu_speed):
        self.paddle_pos = [screen_width-10, screen_height // 2]
        self.paddle_height = paddle_height
        self.speed = cpu_speed

    def update(self, ball_y):
        y = self.paddle_pos[1] + self.paddle_height // 2

        if(y < ball_y - 10):
            self.paddle_pos[1] += self.speed

        elif y > ball_y + 10:
            self.paddle_pos[1] -= self.speed

    def get_pos(self):
        return self.paddle_pos[0], self.paddle_pos[1]


class PongEnv(gym.Env):
    def __init__(self):

        # Set up the Pygame window
        pygame.init()
        self.screen_width = 640
        self.screen_height = 480
        self.screen = pygame.display.set_mode(
            (self.screen_width, self.screen_height))
        pygame.display.set_caption("Pong")
        self.clock = pygame.time.Clock()

        # Define action and observation space
        # 0: Stay, 1: Move Up, 2: Move Down
        self.action_space = spaces.Discrete(3)
        self.observation_space = spaces.Box(low=0, high=255, shape=(
            self.screen_height, self.screen_width, 3), dtype=np.uint8)

        # Game variables
        self.ball_radius = 10
        self.paddle_width = 15
        self.paddle_height = 60
        self.paddle_speed = 5

        self.ball_pos = [self.screen_width // 2, self.screen_height // 2]

        self.paddle_pos = [10, self.screen_height // 2]

        self.ball_vel = np.random.uniform(2, 4, size=2).tolist()

        
        self.ball_speed = 0.004
        # numpy lokey weird
        self.ball_angle = np.random.rand(1,1)
        self.ball_angle = self.ball_angle[0] * np.pi 
        self.ball_vel[0] = np.cos(self.angle) * self.ball_speed;
        self.ball_vel[1] = np.sin(self.angle) * self.ball_speed;


        cpu_speed = 0.9 * self.ball_vel[1]
        self.cpu = PongCPU(self.screen_width, self.screen_height,
                           self.paddle_height, cpu_speed)

    def reset(self):
        # Reset the game state
        self.ball_pos = [self.screen_width // 2, self.screen_height // 2]
        self.ball_vel = np.random.uniform(2, 4, size=2).tolist()

        self.ball_speed = 0.004
        self.ball_angle = np.random.rand(1,1)
        self.ball_angle = self.ball_angle[0] * np.pi 
        self.ball_vel[0] = np.cos(self.angle) * self.ball_speed;
        self.ball_vel[1] = np.sin(self.angle) * self.ball_speed;

        self.paddle_pos = [10, self.screen_height // 2]
        self.screen.fill((0, 0, 0))
        pygame.display.flip()

        return self._get_screen()

    def step(self, action):

        # Perform the given action and return the new state, reward, and terminal flag
        reward = 0
        done = False

        # Update paddle position based on action
        if action == 1:  # Move Up
            self.paddle_pos[1] -= self.paddle_speed
        elif action == 2:  # Move Down
            self.paddle_pos[1] += self.paddle_speed

        # self.paddle_pos[1] = self.ball_pos[1]-30 # action aligns with ball perfectly

        # Update ball position

        self.ball_pos[0] += self.ball_vel[0]
        self.ball_pos[1] += self.ball_vel[1]

        self.cpu.update(self.ball_pos[1])
        cpu_x, cpu_y = self.cpu.get_pos()

        # vertical collision
        if self.ball_pos[1] <= 0 + self.ball_radius or self.ball_pos[1] >= self.screen_height - self.ball_radius:
            self.ball_vel[1] = -self.ball_vel[1]

        # velocity[0] = velocity[0] * -1;

        # Check for collision with paddle
        if self.ball_pos[0] <= self.paddle_pos[0] + self.paddle_width and self.paddle_pos[1] <= self.ball_pos[1] <= self.paddle_pos[1] + self.paddle_height:
            self.speed = self.speed * 1.01
            self.angle = ((np.pi * 2) + (self.paddle / (self.ball_pos[1] - self.paddle_pos[1])) * (np.pi / 3));
            # angle = (cAngleOffset + (ball.current.position.y - cpuPosRef.current.y) * cAngleRange);
            self.ball_vel[0] = np.cos(self.angle) * self.speed;
            self.ball_vel[1] = np.sin(self.angle) * self.speed;

        elif self.ball_pos[0] >= cpu_x and cpu_y <= self.ball_pos[1] <= cpu_y + self.paddle_height:
            self.speed = self.speed * 1.01
            self.angle = (((4 * np.pi) / 3) - (((self.ball_pos[1] - cpu_y) / paddle_height) * ((2 * np.pi) / 3)));
            self.ball_vel[0] = np.cos(self.angle) * self.speed;
            self.ball_vel[1] = np.sin(self.angle) * self.speed;

        # velocity[0] = velocity[0] * -1.05;
        # //velocity[1] = velocity[1] + 1.05 *  (ball.current.position.y - cpuPosRef.current.y) * 0.004;


        # Check for ball out of bounds
        if self.ball_pos[0] <= 0:
            done = True
            reward = -1
        elif self.ball_pos[0] >= self.screen_width:
            done = True
            reward = 1

        self.screen.fill((0, 0, 0))

        pygame.draw.rect(self.screen, (255, 255, 255),
                         (self.paddle_pos[0], self.paddle_pos[1], self.paddle_width, self.paddle_height))  # AI

        pygame.draw.rect(self.screen, (255, 255, 255),
                         (cpu_x, cpu_y, self.paddle_width, self.paddle_height))  # CPU

        pygame.draw.circle(self.screen, (255, 255, 255),
                           self.ball_pos, self.ball_radius)
        pygame.display.flip()

        return self._get_screen(), reward, done, {}

    def _get_screen(self):
        # Return the current game screen as an observation
        screen = pygame.surfarray.array3d(pygame.display.get_surface())
        screen = np.transpose(screen, (1, 0, 2))
        return screen

    def render(self):
        # Render the game screen
        pygame.display.update()
        self.clock.tick(60)


env = PongEnv()

# Reset the environment
observation = env.reset()

# Game loop
done = False
while not done:
    # Render the game screen
    env.render()

    # Take a random action
    action = env.action_space.sample()  # random choice for now

    # Step the environment
    observation, reward, done, _ = env.step(action)

    # Slow down the game loop for visualization
    pygame.time.delay(10)

# Close the Pygame window
print("quitting")
pygame.quit()
sys.exit()


# In[ ]:


# In[ ]:

