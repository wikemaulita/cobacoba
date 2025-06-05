// src/pages/pulau.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import bali from '../assets/images/balipage.webp';
import sumatra from '../assets/images/sumatra.webp';
import kalimantan from '../assets/images/kalimantan.webp';
import maluku from '../assets/images/maluku.webp';
import jawa from '../assets/images/jawa.webp';
import papua from '../assets/images/papua.webp';
import sulawesi from '../assets/images/sulawesi.webp';

export const sections = [ // <-- Tambahkan 'export' di sini
  {
    id: 1,
    title: 'Sumatra',
    description: 'Sumatra, sebuah pulau besar di Indonesia, mempesona dengan kekayaan budaya dan alamnya yang luar biasa. Dari keindahan Danau Toba yang legendaris, gunung berapi yang megah seperti Gunung Kerinci, hingga hutan hujan tropis yang menjadi rumah bagi orangutan Sumatra. Budaya Batak, Minangkabau, dan Melayu menawarkan tarian, musik, dan arsitektur tradisional yang unik. Kuliner pedas seperti Rendang Minang yang terkenal di dunia adalah ciri khas tak terlupakan. Sumatra adalah perpaduan sempurna antara petualangan alam dan kekayaan tradisi.',
    imageUrl: sumatra,
    path: '/sumatra',
  },
  {
    id: 2,
    title: 'Jawa',
    description: 'Jawa, jantung budaya dan sejarah Indonesia, menawarkan perpaduan pesona alam dan warisan kuno. Dari candi megah Borobudur dan Prambanan, gunung berapi aktif seperti Bromo dan Merapi, hingga pantai-pantai indah yang tersembunyi. Jawa adalah rumah bagi budaya Jawa, Sunda, dan Betawi yang kaya akan tradisi wayang kulit, gamelan, dan batik. Kehidupan kota yang ramai di Jakarta, Yogyakarta yang penuh seni, dan Bandung yang kreatif, semuanya mencerminkan dinamisme pulau ini.',
    imageUrl: jawa,
    path: '/jawa',
  },
  {
    id: 3,
    title: 'Kalimantan',
    description: 'Kalimantan, pulau terbesar ketiga di dunia, adalah surga tropis yang terkenal dengan hutan hujan lebat dan keanekaragaman hayati yang tak tertandingi. Pulau ini adalah rumah bagi orangutan, bekantan, dan berbagai flora serta fauna endemik. Budaya Dayak yang otentik, dengan ritual adat, tarian tradisional, dan ukiran kayu yang rumit, menjadi daya tarik utama. Sungai-sungai besar yang membelah hutan menawarkan petualangan yang tak terlupakan, mulai dari susur sungai hingga eksplorasi desa-desa terpencil.',
    imageUrl: kalimantan,
    path: '/kalimantan',
  },
  {
    id: 4,
    title: 'Bali',
    description: 'Bali, pulau dewata yang memukau, adalah permata pariwisata Indonesia yang terkenal di seluruh dunia. Dikenal dengan keindahan alamnya yang eksotis, mulai dari pantai berpasir putih hingga sawah terasering yang hijau. Bali juga kaya akan budaya Hindu yang kuat, terlihat dari pura-pura megah, upacara adat yang penuh warna, dan tarian-tarian anggun seperti Tari Kecak dan Tari Barong. Kehidupan spiritual, seni, dan kuliner yang semarak menjadikan Bali destinasi impian bagi setiap wisatawan.',
    imageUrl: bali,
    path: '/bali',
  },
  {
    id: 5,
    title: 'Sulawesi',
    description: 'Sulawesi, pulau dengan bentuk unik menyerupai huruf K, mempesona dengan keindahan bawah lautnya yang menakjubkan dan warisan budayanya yang kaya. Terumbu karang Wakatobi yang spektakuler menarik para penyelam dari seluruh dunia. Di daratan, Anda dapat menjelajahi Tana Toraja dengan rumah adat Tongkonan yang megah dan upacara pemakaman unik. Budaya Bugis-Makassar yang terkenal dengan kapal pinisi dan tradisi maritimnya juga menjadi bagian tak terpisahkan dari identitas Sulawesi.',
    imageUrl: sulawesi,
    path: '/sulawesi',
  },
  {
    id: 6,
    title: 'Maluku',
    description: 'Maluku, yang dikenal sebagai "Kepulauan Rempah-Rempah", adalah gugusan pulau yang menawarkan keindahan alam yang masih asli dan sejarah yang kaya. Pantai berpasir putih, laut biru jernih, dan kehidupan bawah laut yang memukau adalah daya tarik utamanya. Sejarah perdagangan rempah-rempah yang intens meninggalkan jejak berupa benteng-benteng peninggalan kolonial. Budaya lokal yang beragam, dengan tarian cakalele dan musik tifa, menambah pesona eksotis Maluku.',
    imageUrl: maluku,
    path: '/maluku',
  },
  {
    id: 7,
    title: 'Papua',
    description: 'Papua, pulau paling timur Indonesia, adalah permata tersembunyi dengan keindahan alam yang tak terjamah dan kekayaan budaya yang sangat autentik. Hutan hujan lebat yang menjadi paru-paru dunia, gunung-gunung menjulang tinggi seperti Puncak Jaya yang bersalju, dan keanekaragaman hayati yang luar biasa adalah ciri khasnya. Budaya suku-suku asli seperti Dani dan Asmat yang masih menjaga tradisi nenek moyang mereka, dengan festival dan ritual adat yang unik, menawarkan pengalaman tak terlupakan bagi para petualang dan penjelajah budaya.',
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