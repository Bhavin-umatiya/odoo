/**
 * EmailStorage.js - User management system for EcoFinds
 * 
 * Note: The actual implementation is now inline in index.html for reliability
 * This file serves as a backup and documentation
 */

// If the inline implementation already exists, don't override it
if (typeof EmailStorage === 'undefined') {
    console.log('Loading EmailStorage from external file');
    
    window.EmailStorage = {
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
                id: Date.now(),
                name,
                email,
                password, // In a real app, you should hash this password
                role: role || 'buyer',
                dateJoined: new Date().toISOString()
            };
            
            // Add to users array
            this.users.push(newUser);
            
            // Save to localStorage
            localStorage.setItem('users', JSON.stringify(this.users));
            return newUser;
        },
        
        // Get user by email
        getUserByEmail: function(email) {
            return this.users.find(user => user.email === email);
        },
        
        // Verify login credentials
        verifyUser: function(email, password) {
            const user = this.users.find(user => user.email === email && user.password === password);
            if (user && !user.role) {
                user.role = 'buyer';
            }
            return user;
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
        },
        
        // Update user data
        updateUser: function(userId, userData) {
            const userIndex = this.users.findIndex(user => user.id === userId);
            if (userIndex === -1) return false;
            
            this.users[userIndex] = { ...this.users[userIndex], ...userData };
            localStorage.setItem('users', JSON.stringify(this.users));
            return this.users[userIndex];
        },
        
        // Upgrade user to seller role
        upgradeToSeller: function(userId) {
            const userIndex = this.users.findIndex(user => user.id === userId);
            if (userIndex === -1) return false;
            
            this.users[userIndex].role = 'seller';
            this.users[userIndex].dateUpgraded = new Date().toISOString();
            localStorage.setItem('users', JSON.stringify(this.users));
            return this.users[userIndex];
        }
    };
    
    console.log('EmailStorage loaded successfully from file');
} else {
    console.log('EmailStorage already defined, using existing implementation');
}
