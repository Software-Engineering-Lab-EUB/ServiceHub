
const db = require('./db');

// Insert demo services
const demoServices = [
    {
        provider_id: 1,
        service_name: 'Home Cleaning',
        category: 'cleaning',
        description: 'Professional home cleaning service',
        price: 80.00,
        availability: 'Mon-Sat'
    },
    {
        provider_id: 1,
        service_name: 'Appliance Repair',
        category: 'repair',
        description: 'Fix any household appliance',
        price: 120.00,
        availability: 'Mon-Fri'
    },
    {
        provider_id: 1,
        service_name: 'Garden Maintenance',
        category: 'maintenance',
        description: 'Complete garden care service',
        price: 95.00,
        availability: 'Mon-Sun'
    }
];

demoServices.forEach(service => {
    db.run(
        `INSERT INTO services (provider_id, service_name, category, description, price, availability) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [service.provider_id, service.service_name, service.category, service.description, service.price, service.availability]
    );
});

console.log('Demo data inserted successfully!');
