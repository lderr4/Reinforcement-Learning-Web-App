import re
import matplotlib.pyplot as plt

file = open("progress.txt")
lines = file.readlines()
avg_frames = []
total_reward = []
episode = []
for line in lines:
    if "Epoch 1" in line or line == "\n":
        continue

    nums = re.findall(r"[-+]?(?:\d*\.*\d+)", line)
    if len(nums) == 3:
        episode.append(int(nums[0]))
        avg_frames.append(float(nums[2]))
        total_reward.append(float(nums[1]))

plt.plot(episode, avg_frames)
plt.title("Average Game Length")
plt.xlabel("Episode Number")
plt.ylabel("Average Number of Frames")
plt.savefig("avg_frames.png")
plt.close()

plt.plot(episode, total_reward)
plt.title("Total Reward")
plt.xlabel("Episode Number")
plt.ylabel("Total Reward")
plt.savefig("total_reward.png")
