import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { Task } from '../types/Task';

const API_URL = 'http://localhost:3000/api'; // TODO: Move to env config

type TaskDetailRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;

export function TaskDetailScreen() {
  const route = useRoute<TaskDetailRouteProp>();
  const { taskId } = route.params;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/tasks/${taskId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch task');
      }
      const data = await response.json();
      setTask(data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      Alert.alert('Error', 'Failed to load task details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer} accessible={true} accessibilityLabel="Loading task details">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Loading task...</Text>
      </View>
    );
  }

  if (error || !task) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          {error || 'Task not found'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      accessible={true}
      accessibilityLabel={`Task details for ${task.title}`}
    >
      <View style={styles.section}>
        <Text
          style={styles.title}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel={`Task title: ${task.title}`}
        >
          {task.title}
        </Text>
      </View>

      {task.description && (
        <View style={styles.section}>
          <Text
            style={styles.label}
            accessible={true}
            accessibilityRole="text"
          >
            Description
          </Text>
          <Text
            style={styles.description}
            accessible={true}
            accessibilityLabel={`Description: ${task.description}`}
          >
            {task.description}
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Status</Text>
        <Text
          style={styles.status}
          accessible={true}
          accessibilityLabel={`Status: ${task.status}`}
        >
          {task.status}
        </Text>
      </View>

      {task.dueDate && (
        <View style={styles.section}>
          <Text style={styles.label}>Due Date</Text>
          <Text
            accessible={true}
            accessibilityLabel={`Due date: ${new Date(task.dueDate).toLocaleDateString()}`}
            style={styles.dueDate}
          >
            {new Date(task.dueDate).toLocaleDateString()}
          </Text>
        </View>
      )}

      {task.hasMedia && task.altText && (
        <View style={styles.section}>
          <Text style={styles.label}>Media Description</Text>
          <Text
            style={styles.altText}
            accessible={true}
            accessibilityLabel={`Media description: ${task.altText}`}
          >
            {task.altText}
          </Text>
        </View>
      )}

      {task.labels && task.labels.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.label}>Labels</Text>
          <View style={styles.labelsContainer}>
            {task.labels.map((label, index) => (
              <View
                key={index}
                style={styles.labelTag}
                accessible={true}
                accessibilityLabel={`Label: ${label}`}
              >
                <Text style={styles.labelTagText}>{label}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* TODO: Add edit and delete buttons */}
      {/* TODO: Implement keyboard navigation for edit/delete actions */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 24,
  },
  status: {
    fontSize: 16,
    color: '#1f2937',
    textTransform: 'capitalize',
  },
  dueDate: {
    fontSize: 16,
    color: '#1f2937',
  },
  altText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  labelTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  labelTagText: {
    fontSize: 14,
    color: '#1f2937',
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
  },
});

