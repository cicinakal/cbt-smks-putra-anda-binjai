export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">CBT SMKS Putra Anda Binjai</h1>
          <p className="text-blue-100 text-xl">Sistem Ujian Online Modern</p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Ujian Fleksibel</h3>
            <p className="text-gray-600">
              Berbagai tipe soal: Pilihan Ganda, Uraian, Benar/Salah, dan Pencocokan
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-3">⏱️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Timer Real-time</h3>
            <p className="text-gray-600">
              Durasi 1 jam per ujian dengan penghitung waktu real-time dan auto-submit
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Hasil Instan</h3>
            <p className="text-gray-600">Lihat skor dan analisis jawaban Anda langsung setelah selesai</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 inline-block">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Mulai Sekarang</h2>
            <div className="space-y-3">
              <a
                href="/login"
                className="block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Login Siswa
              </a>
              <a
                href="/admin/login"
                className="block px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
              >
                Login Admin/Guru
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
