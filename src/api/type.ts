export interface SimplifiedUser {
  username: string;
  profile_picture: string;
}
export interface Comment {
  comment_id: string;
  commenter_user: SimplifiedUser;
  created_date: string;
  message: string;
  rating: number;
  user_rating: number;
}

export interface Publication {
  publication_id: string;
  poster_user: SimplifiedUser;
  created_date: string;
  picture: string;
  description: string;
  tags: string[];
  rating: number;
  user_rating: number;
  nb_comments: number;
  comments: Comment[];
}

export interface SimplifiedPublication {
  publication_id: string;
  picture: string;
}

export interface User {
  username: string;
  name: string;
  profile_picture: string;
  nb_followers: number;
  nb_following: number;
  followers: SimplifiedUser[];
  following: SimplifiedUser[];
  biography: string;
  age: number;
  created_date: string;
  nb_publications: number;
  publications: SimplifiedPublication[];
  gallerys: [];
  followed_by_user: boolean;
}

export interface SimplifiedUserWithName {
  username: string;
  name: string;
  profile_picture: string;
}
export interface Gallery {
  gallery_id: string;
  title: string;
  publications: SimplifiedPublication[];
}
