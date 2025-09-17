import { 
 
  StyleSheet, 
  ScrollView, 

  SafeAreaView 
} from 'react-native';

import { PostCard } from '@/components/PostCard';
import { Header } from '@/components/Header';


const posts = [
  {
    id: '1',
    user: {
      name: 'Rohit Badmal',
      location: 'New Delhi',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    timestamp: 'Yesterday at 5:30',
    content: 'First Post ✋',
    image: 'https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    likes: 12,
    comments: 12,
    shares: 4,
    userComments: [
      {
        user: 'Rohit',
        comment: 'Ye Kya Bana diye ho?',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'
      }
    ]
  },
  {
    id: '2',
    user: {
      name: 'Rohit Badmal',
      location: 'New Delhi',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    timestamp: 'Yesterday at 5:30',
    content: 'Beautiful day in the city! 🌟',
    image: 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    likes: 25,
    comments: 8,
    shares: 3,
    userComments: []
  }
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.feed} showsVerticalScrollIndicator={false}>
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  feed: {
    flex: 1,
  },
});