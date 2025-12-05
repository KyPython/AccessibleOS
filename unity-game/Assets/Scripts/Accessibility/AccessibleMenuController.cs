using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using System.Collections.Generic;

namespace AccessibleOS.Accessibility
{
    /// <summary>
    /// Controller for accessible menu navigation with keyboard/gamepad support.
    /// Provides proper focus management, screen reader announcements, and audio cues.
    /// </summary>
    public class AccessibleMenuController : MonoBehaviour
    {
        [Header("Navigation Settings")]
        [Tooltip("Allow keyboard navigation")]
        public bool enableKeyboardNavigation = true;

        [Tooltip("Allow gamepad navigation")]
        public bool enableGamepadNavigation = true;

        [Tooltip("Auto-select first menu item on enable")]
        public bool autoSelectFirstItem = true;

        [Header("Audio Feedback")]
        [Tooltip("Play sound when navigating menu items")]
        public bool playNavigationSound = true;

        [Tooltip("Audio source for navigation sounds")]
        public AudioSource audioSource;

        [Tooltip("Sound clip for menu navigation")]
        public AudioClip navigationSound;

        [Header("Focus Indicator")]
        [Tooltip("Visual indicator for focused menu item")]
        public GameObject focusIndicator;

        private List<Selectable> menuItems = new List<Selectable>();
        private int currentIndex = 0;
        private EventSystem eventSystem;

        void Start()
        {
            eventSystem = EventSystem.current;
            
            if (eventSystem == null)
            {
                Debug.LogError("No EventSystem found. Please add an EventSystem to the scene.");
                return;
            }

            // Find all selectable menu items
            FindMenuItems();

            // Auto-select first item if enabled
            if (autoSelectFirstItem && menuItems.Count > 0)
            {
                SelectMenuItem(0);
            }

            // Initialize screen reader announcement
            AnnounceMenuLoaded();
        }

        void Update()
        {
            if (menuItems.Count == 0) return;

            HandleKeyboardNavigation();
            HandleGamepadNavigation();
        }

        /// <summary>
        /// Find all selectable UI elements in the menu
        /// </summary>
        private void FindMenuItems()
        {
            menuItems.Clear();
            Selectable[] selectables = GetComponentsInChildren<Selectable>(true);
            
            foreach (Selectable selectable in selectables)
            {
                // Only include interactable items
                if (selectable.interactable)
                {
                    menuItems.Add(selectable);
                }
            }
        }

        /// <summary>
        /// Handle keyboard navigation (Arrow keys, Tab, Enter)
        /// </summary>
        private void HandleKeyboardNavigation()
        {
            if (!enableKeyboardNavigation) return;

            // Vertical navigation with Arrow keys
            if (Input.GetKeyDown(KeyCode.UpArrow))
            {
                NavigateMenu(-1);
            }
            else if (Input.GetKeyDown(KeyCode.DownArrow))
            {
                NavigateMenu(1);
            }

            // Horizontal navigation (for horizontal menus)
            if (Input.GetKeyDown(KeyCode.LeftArrow))
            {
                NavigateMenu(-1);
            }
            else if (Input.GetKeyDown(KeyCode.RightArrow))
            {
                NavigateMenu(1);
            }

            // Tab navigation
            if (Input.GetKeyDown(KeyCode.Tab))
            {
                if (Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift))
                {
                    NavigateMenu(-1);
                }
                else
                {
                    NavigateMenu(1);
                }
            }

            // Enter/Space to activate
            if (Input.GetKeyDown(KeyCode.Return) || Input.GetKeyDown(KeyCode.Space))
            {
                ActivateCurrentMenuItem();
            }
        }

        /// <summary>
        /// Handle gamepad navigation
        /// TODO: Implement with Unity Input System for better gamepad support
        /// </summary>
        private void HandleGamepadNavigation()
        {
            if (!enableGamepadNavigation) return;

            // TODO: Use Unity Input System for gamepad input
            // Example: Gamepad.current.dpad.up.wasPressedThisFrame
            // For now, this is a placeholder for gamepad navigation
        }

        /// <summary>
        /// Navigate to next/previous menu item
        /// </summary>
        private void NavigateMenu(int direction)
        {
            if (menuItems.Count == 0) return;

            currentIndex += direction;

            // Wrap around
            if (currentIndex < 0)
            {
                currentIndex = menuItems.Count - 1;
            }
            else if (currentIndex >= menuItems.Count)
            {
                currentIndex = 0;
            }

            SelectMenuItem(currentIndex);
        }

        /// <summary>
        /// Select a menu item by index
        /// </summary>
        private void SelectMenuItem(int index)
        {
            if (index < 0 || index >= menuItems.Count) return;

            currentIndex = index;
            Selectable item = menuItems[index];

            // Set as selected in EventSystem
            eventSystem.SetSelectedGameObject(item.gameObject);

            // Play navigation sound
            if (playNavigationSound && audioSource != null && navigationSound != null)
            {
                audioSource.PlayOneShot(navigationSound);
            }

            // Show focus indicator
            ShowFocusIndicator(item.gameObject);

            // Announce to screen reader
            AnnounceMenuItem(item);
        }

        /// <summary>
        /// Activate the currently selected menu item
        /// </summary>
        private void ActivateCurrentMenuItem()
        {
            if (currentIndex < 0 || currentIndex >= menuItems.Count) return;

            Selectable item = menuItems[currentIndex];
            Button button = item.GetComponent<Button>();

            if (button != null && button.interactable)
            {
                button.onClick.Invoke();
                
                // TODO: Play activation sound
                // TODO: Announce activation to screen reader
            }
        }

        /// <summary>
        /// Show visual focus indicator on menu item
        /// </summary>
        private void ShowFocusIndicator(GameObject target)
        {
            if (focusIndicator == null) return;

            focusIndicator.transform.SetParent(target.transform, false);
            focusIndicator.transform.SetAsFirstSibling();
            focusIndicator.SetActive(true);
        }

        /// <summary>
        /// Announce menu loaded to screen reader
        /// </summary>
        private void AnnounceMenuLoaded()
        {
            // TODO: Integrate with screen reader API
            // Example: ScreenReaderIntegration.Announce("Menu loaded. Use arrow keys to navigate.");
            Debug.Log("[Screen Reader] Menu loaded. Use arrow keys to navigate.");
        }

        /// <summary>
        /// Announce menu item to screen reader
        /// </summary>
        private void AnnounceMenuItem(Selectable item)
        {
            // Get accessible label from component or use GameObject name
            string label = GetAccessibleLabel(item.gameObject);
            
            // TODO: Integrate with screen reader API
            // Example: ScreenReaderIntegration.Announce(label);
            Debug.Log($"[Screen Reader] {label}");
        }

        /// <summary>
        /// Get accessible label for a UI element
        /// TODO: Implement proper accessibility component system
        /// </summary>
        private string GetAccessibleLabel(GameObject obj)
        {
            // Check for Text component
            Text text = obj.GetComponent<Text>();
            if (text != null && !string.IsNullOrEmpty(text.text))
            {
                return text.text;
            }

            // Check for Button component
            Button button = obj.GetComponent<Button>();
            if (button != null)
            {
                Text buttonText = button.GetComponentInChildren<Text>();
                if (buttonText != null && !string.IsNullOrEmpty(buttonText.text))
                {
                    return buttonText.text;
                }
            }

            // Fallback to GameObject name
            return obj.name;
        }

        /// <summary>
        /// Public method to refresh menu items (useful for dynamic menus)
        /// </summary>
        public void RefreshMenuItems()
        {
            FindMenuItems();
            
            if (menuItems.Count > 0 && currentIndex < menuItems.Count)
            {
                SelectMenuItem(currentIndex);
            }
            else if (autoSelectFirstItem && menuItems.Count > 0)
            {
                SelectMenuItem(0);
            }
        }
    }
}

