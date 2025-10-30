import pandas as pd

# Load original data
try:
    data = pd.read_csv("socialMedia.csv")
except FileNotFoundError:
    print("Error: socialMedia.csv not found.")
    print("Please make sure this script is in the same folder as socialMedia.csv")
    exit()

# Create socialMediaAvg.csv

avg_likes_platform = data.groupby(['Platform', 'PostType'])['Likes'].mean()

avg_likes_platform = avg_likes_platform.round(2).reset_index()

avg_likes_platform = avg_likes_platform.rename(columns={'Likes': 'AvgLikes'})

avg_likes_platform.to_csv("socialMediaAvg.csv", index=False)


# Create socialMediaTime.csv 

avg_likes_time = data.groupby('Date')['Likes'].mean()

avg_likes_time = avg_likes_time.round(6).reset_index()

avg_likes_time = avg_likes_time.rename(columns={'Likes': 'AvgLikes'})

avg_likes_time.to_csv("socialMediaTime.csv", index=False)