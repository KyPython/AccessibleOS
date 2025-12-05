import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Task } from '../types/Task';

const API_URL = 'http://localhost:3000/api'; // TODO: Move to env config

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function TaskListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // TODO: Update API URL based on platform (iOS simulator vs Android emulator)
      const response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      Alert.alert('Error', 'Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Task: ${item.title}. Status: ${item.status}`}
      accessibilityHint="Double tap to view task details"
    >
      <Text style={styles.taskTitle}>{item.title}</Text>
      {item.description && (
        <Text
          style={styles.taskDescription}
          accessible={true}
          accessibilityLabel={`Description: ${item.description}`}
        >
          {item.description}
        </Text>
      )}
      <View style={styles.taskMeta}>
        <Text
          style={styles.taskStatus}
          accessible={true}
          accessibilityLabel={`Status: ${item.status}`}
        >
          {item.status}
        </Text>
        {item.dueDate && (
          <Text
            accessible={true}
            accessibilityLabel={`Due date: ${new Date(item.dueDate).toLocaleDateString()}`}
            style={styles.taskDueDate}
          >
            Due: {new Date(item.dueDate).toLocaleDateString()}
          </Text>
        )}
      </View>
      {item.hasMedia && item.altText && (
        <Text
          style={styles.taskAltText}
          accessible={true}
          accessibilityLabel={`Media description: ${item.altText}`}
        >
          Media: {item.altText}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer} accessible={true} accessibilityLabel="Loading tasks">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchTasks}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Retry loading tasks"
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No tasks found. Create your first task to get started!
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        accessibilityLabel="Task list"
        accessibilityRole="list"
      />
      {/* TODO: Add floating action button for creating new tasks */}
      {/* TODO: Implement keyboard navigation hints for external keyboards */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  listContent: {
    padding: 16,
  },
  taskItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    // Focus styles for keyboard navigation
    // TODO: Add platform-specific focus styles
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskStatus: {
    fontSize: 12,
    textTransform: 'capitalize',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: '#6b7280',
  },
  taskDueDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  taskAltText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#6b7280',
    marginTop: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: '#dc2626',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});

