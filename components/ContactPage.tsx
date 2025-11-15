import React from 'react';

const ContactPage: React.FC = () => {
    return (
        <div className="flex flex-col h-full w-full bg-gray-50 dark:bg-gray-900 overflow-y-auto">
            <header className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Contact Us</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">We'd love to hear from you!</p>
            </header>
            <div className="flex-grow p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Contact Info */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Get in Touch</h2>
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                            <p className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg> 123 Pizza Lane, Tech City, 10101</p>
                            <p className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg> (555) 123-4567</p>
                            <p className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg> contact@stanleysrestaurant.com</p>
                        </div>
                        <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-800 dark:text-white">Hours</h3>
                        <p className="text-gray-700 dark:text-gray-300">Mon - Sun: 11:00 AM - 10:00 PM</p>
                    </div>

                    {/* Map */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-64 lg:h-auto">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.257593258525!2d-122.4217204846816!3d37.78443287975764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858097b8ebb957%3A0xbe10237107779b5c!2sTwitter%20HQ!5e0!3m2!1sen!2sus!4v1628892463421!5m2!1sen!2sus" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen={false}
                            loading="lazy"
                            title="Restaurant Location"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;