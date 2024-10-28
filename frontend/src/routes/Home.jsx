import 'react-calendar/dist/Calendar.css';
import '../style/Home.css';

const Home = () => {
    const message1 = "WELCOME"; // First part of the message
    const message2 = "DARLING!"; // Second part of the message

    return (
        <div className="home-container">
            <h1 className="wave-message">
                {message1.split('').map((letter, index) => (
                    <span key={index} className="wave-letter" style={{ animationDelay: `${index * 0.1}s` }}>
                        {letter}
                    </span>
                ))}
                {/* Add space between the two messages */}
                <span className="space">   </span>

                {message2.split('').map((letter, index) => (
                    <span key={index + message1.length} className="wave-letter" style={{ animationDelay: `${(index + message1.length) * 0.1}s` }}>
                        {letter}
                    </span>
                ))}
            </h1>
        </div>
    );
};

export default Home;
