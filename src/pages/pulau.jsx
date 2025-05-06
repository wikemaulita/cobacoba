import React from 'react';
import { Link } from 'react-router-dom';
import bali from '../assets/images/balipage.webp';
import sumatra from '../assets/images/sumatra.webp';
import kalimantan from '../assets/images/kalimantan.webp';
import maluku from '../assets/images/maluku.webp';
import jawa from '../assets/images/jawa.webp';
import papua from '../assets/images/papua.webp';
import sulawesi from '../assets/images/sulawesi.webp';

const sections = [
  {
    id: 1,
    title: 'Sumatra',
    description: 'Menampilkan keindahan seni dan budaya Sumatra.',
    imageUrl: sumatra,
    path: '/sumatra',
  },
  {
    id: 2,
    title: 'Jawa',
    description: 'Menampilkan keindahan alam dan budaya Jawa.',
    imageUrl: jawa,
    path: '/jawa',
  },
  {
    id: 3,
    title: 'Kalimantan',
    description: 'Menampilkan keindahan alam dan budaya Kalimantan.',
    imageUrl: kalimantan,
    path: '/kalimantan',
  },
  {
    id: 4,
    title: 'Bali',
    description: 'Pameran seni yang menggambarkan budaya Bali yang kaya.',
    imageUrl: bali,
    path: '/bali',
  },
  {
    id: 5,
    title: 'Sulawesi',
    description: 'Menampilkan keindahan alam dan budaya Sulawesi.',
    imageUrl: sulawesi,
    path: '/sulawesi',
  },
  {
    id: 6,
    title: 'Maluku',
    description: 'Menampilkan keindahan alam dan budaya Maluku.',
    imageUrl: maluku,
    path: '/maluku',
  },
  {
    id: 7,
    title: 'Papua',
    description: 'Menampilkan keindahan alam dan budaya Papua.',
    imageUrl: papua,
    path: '/papua',
  },
];

const Pulau = () => {
  return (
    <div className="flex flex-wrap justify-center">
      {sections.map((section) => (
        <div 
          key={section.id} 
          className="flex flex-col items-center justify-center p-4 m-4 bg-white rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 w-80"
        >
          <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
          <div className="relative">
            <img 
              src={section.imageUrl} 
              alt={section.title} 
              className="w-full h-48 object-cover rounded-lg brightness-75"
            />
          </div>
          <p className="mt-2 text-center text-gray-700">{section.description}</p>
          <Link 
            to={`/pulau/${section.id}`} 
            className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            Lihat Detail
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Pulau;