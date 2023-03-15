export interface SimplifiedUser {
  username: string;
  profile_picture: string;
}
export interface Comment {
  id: string;
  user: SimplifiedUser;
  date: string;
  content: string;
  total_rate: number;
  user_rate: number;
}

export interface Publication {
  id: string;
  user: SimplifiedUser;
  date: string;
  picture: string;
  desc: string;
  tags: string[];
  total_rate: number;
  user_rate: number;
  comments: Comment[];
}

export interface SimplifiedPost {
  id: string;
  picture: string;
}

export interface User {
  username: string;
  name: string;
  profile_picture: string;
  nb_follower: number;
  nb_following: number;
  biography: string;
  age: number;
  created_date: string;
  posts: SimplifiedPost[];
}
