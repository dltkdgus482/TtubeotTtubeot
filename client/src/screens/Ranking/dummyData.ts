interface RankingProps {
  user_id: number;
  username: string;
  score: number;
  ttubeot_id: number;
}

export const dummyRankingList: RankingProps[] = [
  {
    user_id: 3,
    username: 'bob_jones',
    score: 12000,
    ttubeot_id: 6,
  },
  {
    user_id: 9,
    username: 'grace_hopper',
    score: 11500,
    ttubeot_id: 10,
  },
  {
    user_id: 7,
    username: 'falcon',
    score: 11000,
    ttubeot_id: 4,
  },
  {
    user_id: 6,
    username: 'eve_davis',
    score: 10000,
    ttubeot_id: 8,
  },
  {
    user_id: 2,
    username: 'alice_smith',
    score: 9050,
    ttubeot_id: 5,
  },
  {
    user_id: 8,
    username: 'frank_white',
    score: 90,
    ttubeot_id: 9,
  },
  {
    user_id: 5,
    username: 'dave_wilson',
    score: 85,
    ttubeot_id: 7,
  },
  {
    user_id: 1,
    username: 'john_doe',
    score: 80,
    ttubeot_id: 2,
  },
  {
    user_id: 10,
    username: 'henry_lee',
    score: 75,
    ttubeot_id: 11,
  },
  {
    user_id: 4,
    username: 'charlie_brown',
    score: 70,
    ttubeot_id: 3,
  },
];
