import PageTransition from '../components/PageTransition';
import PageCard from '../components/PageCard';

const Contact = () => {
  return (
    <PageTransition>
      <div className="content-overlay">
        <h1 className="logo" data-text="TWILIGHT CODERS">TWILIGHT CODERS</h1>
        
        <PageCard title="Get In Touch">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          
          <h3>Ways to Reach Us</h3>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          
          <h3>Collaboration Opportunities</h3>
          <ul>
            <li>Open source project contributions and partnerships</li>
            <li>Technical consulting and development services</li>
            <li>Speaking engagements and workshop opportunities</li>
            <li>Community building and developer relations</li>
          </ul>
          
          <p>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia 
            consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro 
            quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
          </p>
          
          <h3>Response Time</h3>
          <p>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium 
            voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint 
            occaecati cupiditate non provident.
          </p>
        </PageCard>
      </div>
    </PageTransition>
  );
};

export default Contact;