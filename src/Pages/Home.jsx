function Home() {
    return (
      <section
        className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-white px-6 text-center"
        style={{ backgroundImage: 'url(/images/home-background.png)' }}
      >
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Jelajah Budaya</h1>
        <p className="text-lg max-w-xl drop-shadow-md">
          Jelajah Budaya adalah website buat adek-adek yang ingin mengenal Indonesia. Jelajahi semua kekayaan budaya yang ada di Indonesia, dan bergabung dalam aktivitas seru!
        </p>
      </section>
    )
  }
  
  export default Home
  