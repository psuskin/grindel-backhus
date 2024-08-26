import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-3xl font-bold text-green-600">
              Grindel Backhaus
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Frische Backwaren und gemütliche Atmosphäre im Herzen von Hamburg.
              Tradition trifft Moderne in jedem Bissen.
            </p>
            <div className="flex space-x-4 pt-4">
              <a
                href="#"
                className="text-green-600 hover:text-white transition duration-300"
              >
                <FaFacebookF size={24} />
              </a>
              <a
                href="#"
                className="text-green-600 hover:text-white transition duration-300"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="#"
                className="text-green-600 hover:text-white transition duration-300"
              >
                <FaTwitter size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-green-600">
              Schnelllinks
            </h4>
            <ul className="space-y-3">
              {["Startseite", "Unser Menü", "Über uns", "Kontakt"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase().replace(" ", "-")}`}
                      className="text-gray-300 hover:text-green-600 transition duration-300 flex items-center"
                    >
                      <span className="mr-2">›</span> {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-green-600">
              Öffnungszeiten
            </h4>
            <ul className="space-y-3">
              {[
                { day: "Montag - Freitag", hours: "7:00 - 19:00" },
                { day: "Samstag", hours: "8:00 - 18:00" },
                { day: "Sonntag", hours: "9:00 - 16:00" },
              ].map((item) => (
                <li
                  key={item.day}
                  className="flex justify-between text-gray-300"
                >
                  <span>{item.day}</span>
                  <span>{item.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-green-600">
              Kontakt
            </h4>
            <ul className="space-y-3">
              {[
                {
                  icon: <FaMapMarkerAlt />,
                  text: "Grindelberg 7, 20144 Hamburg",
                },
                { icon: <FaPhoneAlt />, text: "040 12345678" },
                { icon: <FaEnvelope />, text: "info@grindelbackhaus.de" },
              ].map((item, index) => (
                <li key={index} className="flex items-center text-gray-300">
                  <span className="mr-3 text-green-600">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>
            © {new Date().getFullYear()} Grindel Backhaus. Alle Rechte
            vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
