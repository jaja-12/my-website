// Test script for contact form backend
const testContact = async () => {
  const testData = {
    name: "Test User",
    email: "test@example.com",
    message: "This is a test message from the contact form."
  };

  try {
    const response = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', result);
  } catch (error) {
    console.error('Error testing contact form:', error);
  }
};

// Run the test
testContact();