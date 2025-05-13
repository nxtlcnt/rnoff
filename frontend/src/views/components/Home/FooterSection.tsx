const FooterSection: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white font-jetbrains text-sm">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center">
          <p className="text-white">
            &copy; {new Date().getFullYear()} Geothermal Insights
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition">
              About
            </a>
            <a href="#" className="hover:text-white transition">
              Contact
            </a>
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
