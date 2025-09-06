/**
 * Email Storage System
 * Handles user email storage, newsletter subscriptions, and email validation
 */

// Email data storage objects
const EmailStorage = {
    // Newsletter subscribers
    subscribers: JSON.parse(localStorage.getItem('newsletter_subscribers')) || [],
    
    // User related emails (from user accounts)
    users: JSON.parse(localStorage.getItem('users')) || [],
    
    // Email validation function
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Add a new newsletter subscriber
    addSubscriber: function(email) {
        if (!this.isValidEmail(email)) {
            throw new Error('Invalid email format');
        }
        
        // Check if already subscribed
        if (this.subscribers.includes(email)) {
            return false;
        }
        
        // Add to subscribers list
        this.subscribers.push(email);
        
        // Save to localStorage
        localStorage.setItem('newsletter_subscribers', JSON.stringify(this.subscribers));
        return true;
    },
    
    // Get all newsletter subscribers
    getSubscribers: function() {
        return this.subscribers;
    },
    
    // Check if an email is subscribed to the newsletter
    isSubscribed: function(email) {
        return this.subscribers.includes(email);
    },
    
    // User account related functions
    
    // Add a new user with email and role
    addUser: function(name, email, password, role = 'buyer') {
        if (!this.isValidEmail(email)) {
            throw new Error('Invalid email format');
        }
        
        // Check if user already exists
        if (this.getUserByEmail(email)) {
            return false;
        }
        
        // Create new user
        const newUser = {
            id: this.users.length + 1,
            name,
            email,
            password, // In a real app, you should hash this password
            role,
            dateJoined: new Date().toISOString()
        };
        
        // Add to users array
        this.users.push(newUser);
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(this.users));
        return true;
    },
    
    // Get user by email
    getUserByEmail: function(email) {
        return this.users.find(user => user.email === email);
    },
    
    // Verify login credentials
    verifyUser: function(email, password) {
        return this.users.find(user => user.email === email && user.password === password);
    },
    
    // Update user's email
    updateUserEmail: function(userId, newEmail) {
        if (!this.isValidEmail(newEmail)) {
            throw new Error('Invalid email format');
        }
        
        // Check if email already exists with another user
        const existingUser = this.getUserByEmail(newEmail);
        if (existingUser && existingUser.id !== userId) {
            return false;
        }
        
        // Find user and update email
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return false;
        }
        
        this.users[userIndex].email = newEmail;
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(this.users));
        return true;
    }
};

// Export the EmailStorage object
window.EmailStorage = EmailStorage;
