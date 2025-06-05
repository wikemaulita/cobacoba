// src/pages/DetailPulau.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sections } from './pulau'; // Import data sections dari pulau.jsx
import { Button } from "@/components/ui/button"; // Import Button
import { ArrowLeft } from "lucide-react"; // Import ikon ArrowLeft

const DetailPulau = () => {
  const { id } = useParams(); // Mengambil ID dari URL
  const navigate = useNavigate();
  const [pulau, setPulau] = useState(null);

  useEffect(() => {
    // Mencari data pulau berdasarkan ID
    const foundPulau = sections.find(s => s.id === parseInt(id));
    if (foundPulau) {
      setPulau(foundPulau);
    } else {
      // Jika pulau tidak ditemukan, arahkan ke halaman daftar pulau atau 404
      navigate('/pulau');
    }
  }, [id, navigate]); // Dependensi: id dan navigate

  if (!pulau) {
    return <div>Loading...</div>; // Tampilkan loading state sementara
  }

  return (
    <div className="space-y-6 container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="flex items-center gap-1 -ml-2"
        onClick={() => navigate(-1)} // Kembali ke halaman sebelumnya
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Pulau
      </Button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden md:flex">
        <div className="md:w-1/2">
          <img
            src={pulau.imageUrl}
            alt={pulau.title}
            className="w-full h-64 md:h-full object-cover"
          />
        </div>
        <div className="md:w-1/2 p-6 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{pulau.title}</h1>
          <p className="text-gray-700 leading-relaxed mb-6">
            {pulau.description}
          </p>
          {/* Anda bisa menambahkan lebih banyak detail di sini jika diperlukan */}
          {/* <div className="flex justify-end">
            <Button onClick={() => alert(`Exploring ${pulau.title}`)}>
              Jelajahi Sekarang
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DetailPulau;