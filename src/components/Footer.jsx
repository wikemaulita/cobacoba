const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-2 md:mb-0">&copy; {new Date().getFullYear()} JelajahBudaya. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="https://youtu.be/dQw4w9WgXcQ" className="hover:text-gray-300">Privacy Policy</a>
              <a href="https://youtu.be/dQw4w9WgXcQ" className="hover:text-gray-300">Terms of Service</a>
              <a href="https://youtu.be/dQw4w9WgXcQ" className="hover:text-gray-300">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    )
  }

export default Footer