import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
export function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.userSection}>
        <Image 
          source={{ 
            uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' 
          }}
          style={styles.profileImage}
        />
        <Text style={styles.greeting}>Hey Rohit,</Text>
      </View>
      
      <View style={styles.iconSection}>
        <TouchableOpacity style={styles.iconButton}>
       <AntDesign name="search1" size={24} color="black" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.iconButton}>
          <View style={styles.notificationBadge}>
           <AntDesign name="bells" size={24} color="black" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E6EA',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1E21',
  },
  iconSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  notificationBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3040',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});