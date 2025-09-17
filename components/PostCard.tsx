import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
const { width } = Dimensions.get('window');

interface User {
  name: string;
  location: string;
  avatar: string;
}

interface Comment {
  user: string;
  comment: string;
  avatar: string;
}

interface Post {
  id: string;
  user: User;
  timestamp: string;
  content: string;
  image: string;
  likes: number;
  comments: number;
  shares: number;
  userComments: Comment[];
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{post.user.name}</Text>
            <Text style={styles.userLocation}>{post.user.location}</Text>
            <Text style={styles.timestamp}>{post.timestamp}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.moreButton}>
        <Feather name="more-horizontal" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Post Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: post.image }} style={styles.postImage} />
        <View style={styles.imageCounter}>
          <Text style={styles.imageCounterText}>1/3</Text>
        </View>
      </View>

      {/* Engagement Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>{post.likes} Likes</Text>
        <Text style={styles.statsText}>{post.comments} Comments</Text>
        <Text style={styles.statsText}>{post.shares} Shares</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
        <Feather name="heart" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
         <Feather name="message-square" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="share" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
      {post.userComments.map((comment, index) => (
        <View key={index} style={styles.commentContainer}>
          <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
          <View style={styles.commentContent}>
            <Text style={styles.commentUser}>{comment.user}</Text>
            <Text style={styles.commentText}>{comment.comment}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: 'white',
    marginVertical: 4,
    paddingTop: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 2,
  },
  userLocation: {
    fontSize: 13,
    color: '#8A8D91',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 13,
    color: '#8A8D91',
  },
  moreButton: {
    padding: 8,
  },
  postContent: {
    fontSize: 16,
    color: '#1C1E21',
    paddingHorizontal: 16,
    marginBottom: 12,
    lineHeight: 20,
  },
  imageContainer: {
    position: 'relative',
    width: width,
    height: 300,
  },
  postImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageCounter: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  imageCounterText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E6EA',
  },
  statsText: {
    fontSize: 14,
    color: '#8A8D91',
    marginRight: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E6EA',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  commentContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentUser: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: '#1C1E21',
    lineHeight: 18,
  },
});