using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

namespace AccessibleOS.Tasks
{
    /// <summary>
    /// Controller for task interactions in Unity.
    /// Handles task display, creation, editing, and accessibility features.
    /// </summary>
    public class TaskInteractionController : MonoBehaviour
    {
        [Header("UI References")]
        [Tooltip("Container for task list items")]
        public Transform taskListContainer;

        [Tooltip("Prefab for task list item")]
        public GameObject taskItemPrefab;

        [Header("Accessibility")]
        [Tooltip("Enable keyboard shortcuts")]
        public bool enableKeyboardShortcuts = true;

        [Tooltip("Enable audio cues for task actions")]
        public bool enableAudioCues = true;

        private List<TaskData> tasks = new List<TaskData>();
        private int selectedTaskIndex = -1;

        // Keyboard shortcuts
        private KeyCode createTaskShortcut = KeyCode.N;
        private KeyCode deleteTaskShortcut = KeyCode.Delete;
        private KeyCode editTaskShortcut = KeyCode.E;

        void Start()
        {
            LoadTasks();
            RefreshTaskList();
            
            if (enableKeyboardShortcuts)
            {
                AnnounceKeyboardShortcuts();
            }
        }

        void Update()
        {
            if (enableKeyboardShortcuts)
            {
                HandleKeyboardShortcuts();
            }
        }

        /// <summary>
        /// Load tasks from backend API
        /// TODO: Implement API integration
        /// </summary>
        private void LoadTasks()
        {
            // TODO: Fetch tasks from backend API
            // Example: StartCoroutine(FetchTasksFromAPI());
            
            // Placeholder: Add sample task
            tasks.Add(new TaskData
            {
                id = "1",
                title = "Sample Task",
                description = "This is a sample task",
                status = TaskStatus.PENDING
            });
        }

        /// <summary>
        /// Refresh the task list UI
        /// </summary>
        private void RefreshTaskList()
        {
            if (taskListContainer == null || taskItemPrefab == null)
            {
                Debug.LogWarning("Task list container or prefab not set.");
                return;
            }

            // Clear existing items
            foreach (Transform child in taskListContainer)
            {
                Destroy(child.gameObject);
            }

            // Create UI items for each task
            for (int i = 0; i < tasks.Count; i++)
            {
                CreateTaskListItem(tasks[i], i);
            }

            // Announce task count to screen reader
            AnnounceTaskCount();
        }

        /// <summary>
        /// Create a UI item for a task
        /// </summary>
        private void CreateTaskListItem(TaskData task, int index)
        {
            GameObject item = Instantiate(taskItemPrefab, taskListContainer);
            
            // Set task data
            TaskListItemController itemController = item.GetComponent<TaskListItemController>();
            if (itemController != null)
            {
                itemController.Initialize(task, index, this);
            }

            // Set accessible label
            // TODO: Implement proper accessibility label component
            string accessibleLabel = $"Task {index + 1}: {task.title}. Status: {task.status}";
            // Example: item.GetComponent<AccessibleLabel>().SetLabel(accessibleLabel);
        }

        /// <summary>
        /// Handle keyboard shortcuts for task actions
        /// </summary>
        private void HandleKeyboardShortcuts()
        {
            // Create new task
            if (Input.GetKeyDown(createTaskShortcut) && Input.GetKey(KeyCode.LeftControl))
            {
                CreateNewTask();
            }

            // Delete selected task
            if (Input.GetKeyDown(deleteTaskShortcut) && selectedTaskIndex >= 0)
            {
                DeleteTask(selectedTaskIndex);
            }

            // Edit selected task
            if (Input.GetKeyDown(editTaskShortcut) && selectedTaskIndex >= 0)
            {
                EditTask(selectedTaskIndex);
            }

            // Navigate tasks with arrow keys
            if (Input.GetKeyDown(KeyCode.UpArrow))
            {
                SelectPreviousTask();
            }
            else if (Input.GetKeyDown(KeyCode.DownArrow))
            {
                SelectNextTask();
            }
        }

        /// <summary>
        /// Create a new task
        /// TODO: Open task creation UI/form
        /// </summary>
        private void CreateNewTask()
        {
            Debug.Log("[Task] Creating new task...");
            // TODO: Open task creation form/dialog
            
            if (enableAudioCues)
            {
                // TODO: Play creation sound
            }

            // TODO: Announce to screen reader
            AnnounceToScreenReader("Creating new task. Please fill in the form.");
        }

        /// <summary>
        /// Delete a task
        /// </summary>
        private void DeleteTask(int index)
        {
            if (index < 0 || index >= tasks.Count) return;

            TaskData task = tasks[index];
            
            // TODO: Show confirmation dialog
            // TODO: Call API to delete task
            
            tasks.RemoveAt(index);
            RefreshTaskList();

            if (enableAudioCues)
            {
                // TODO: Play deletion sound
            }

            AnnounceToScreenReader($"Task '{task.title}' deleted.");
        }

        /// <summary>
        /// Edit a task
        /// TODO: Open task edit UI/form
        /// </summary>
        private void EditTask(int index)
        {
            if (index < 0 || index >= tasks.Count) return;

            Debug.Log($"[Task] Editing task: {tasks[index].title}");
            // TODO: Open task edit form/dialog with task data
        }

        /// <summary>
        /// Select previous task in list
        /// </summary>
        private void SelectPreviousTask()
        {
            if (tasks.Count == 0) return;

            selectedTaskIndex--;
            if (selectedTaskIndex < 0)
            {
                selectedTaskIndex = tasks.Count - 1;
            }

            HighlightSelectedTask();
        }

        /// <summary>
        /// Select next task in list
        /// </summary>
        private void SelectNextTask()
        {
            if (tasks.Count == 0) return;

            selectedTaskIndex++;
            if (selectedTaskIndex >= tasks.Count)
            {
                selectedTaskIndex = 0;
            }

            HighlightSelectedTask();
        }

        /// <summary>
        /// Highlight the selected task visually
        /// </summary>
        private void HighlightSelectedTask()
        {
            // TODO: Implement visual highlighting
            if (selectedTaskIndex >= 0 && selectedTaskIndex < tasks.Count)
            {
                TaskData task = tasks[selectedTaskIndex];
                AnnounceToScreenReader($"Selected task: {task.title}. Status: {task.status}");
            }
        }

        /// <summary>
        /// Announce task count to screen reader
        /// </summary>
        private void AnnounceTaskCount()
        {
            string message = $"Task list loaded. {tasks.Count} task{(tasks.Count != 1 ? "s" : "")} found.";
            AnnounceToScreenReader(message);
        }

        /// <summary>
        /// Announce keyboard shortcuts to screen reader
        /// </summary>
        private void AnnounceKeyboardShortcuts()
        {
            // TODO: Announce shortcuts when user presses Help key (F1)
            Debug.Log("[Screen Reader] Keyboard shortcuts available. Press F1 for help.");
        }

        /// <summary>
        /// Announce message to screen reader
        /// TODO: Integrate with screen reader API
        /// </summary>
        private void AnnounceToScreenReader(string message)
        {
            // TODO: Integrate with ScreenReaderIntegration
            // Example: ScreenReaderIntegration.Announce(message);
            Debug.Log($"[Screen Reader] {message}");
        }

        /// <summary>
        /// Public method to set selected task (called from task item)
        /// </summary>
        public void SetSelectedTask(int index)
        {
            selectedTaskIndex = index;
            HighlightSelectedTask();
        }
    }

    /// <summary>
    /// Task data structure
    /// </summary>
    [System.Serializable]
    public class TaskData
    {
        public string id;
        public string title;
        public string description;
        public TaskStatus status;
        public string dueDate;
        public string altText;
        public bool hasMedia;
        public string[] labels;
    }

    /// <summary>
    /// Task status enum
    /// </summary>
    public enum TaskStatus
    {
        PENDING,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }

    /// <summary>
    /// Controller for individual task list items
    /// TODO: Create this component
    /// </summary>
    public class TaskListItemController : MonoBehaviour
    {
        private TaskData taskData;
        private int index;
        private TaskInteractionController parentController;

        public void Initialize(TaskData task, int idx, TaskInteractionController parent)
        {
            taskData = task;
            index = idx;
            parentController = parent;
            
            // TODO: Populate UI elements with task data
        }
    }
}

