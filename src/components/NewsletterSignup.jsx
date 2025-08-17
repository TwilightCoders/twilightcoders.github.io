import { useState } from 'react';
import './NewsletterSignup.scss';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(''); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      // Using Formspree endpoint - you'll need to replace with your actual endpoint
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          _subject: 'Newsletter Subscription - Twilight Coders',
        }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Thanks for subscribing! You\'ll hear from us soon.');
        setEmail('');
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="newsletter-signup">
      <p>Get notified about new projects, tutorials, and tech insights.</p>
      
      <form onSubmit={handleSubmit} className="newsletter-form">
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            disabled={status === 'loading'}
            className="email-input"
          />
          <button
            type="submit"
            disabled={status === 'loading' || !email.trim()}
            className="submit-button"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
        
        {message && (
          <div className={`message ${status === 'success' ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </form>
      
      <p className="privacy-note">
        No spam, unsubscribe at any time. We respect your privacy.
      </p>
    </div>
  );
};

export default NewsletterSignup;