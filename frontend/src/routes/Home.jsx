import 'react-calendar/dist/Calendar.css';
import '../style/Home.css';

const Home = () => {
    const message = "WELCOME DARLING!";

    return (
        <div className="home-container">
            <h1 className="wave-message">
                {message.split('').map((letter, index) => (
                    <span key={index} className="wave-letter" style={{ animationDelay: `${index * 0.1}s` }}>
                        {letter}
                    </span>
                ))}
            </h1>
        </div>
    );
};

export default Home;