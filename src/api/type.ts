export interface User {
  id: string;
  username: string;
  profile_picture: string;
}
export interface Comment {
  user: User;
  date: string;
  content: string;
  total_rate: number;
  user_rate: number;
}

export interface Publication {
  user: User;
  date: string;
  picture: string;
  desc: string;
  tags: string[];
  total_rate: number;
  user_rate: number;
  comments: Comment[];
}
