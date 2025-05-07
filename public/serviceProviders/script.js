// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Example of how you can dynamically fetch tasks or earnings in the future.
    const taskCards = document.querySelectorAll('.task-card');
    
    taskCards.forEach(card => {
        card.addEventListener('click', () => {
            alert('You clicked on a task!');
        });
    });
});
