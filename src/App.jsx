import React, { useState, useEffect } from 'react';

export default function HealthManagementSystem() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  
  const [loginData, setLoginData] = useState({
    accountName: '',
    userId: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [currentPage, setCurrentPage] = useState('home');
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('patients');
    return saved ? JSON.parse(saved) : [];
  });
  const [visits, setVisits] = useState(() => {
    const saved = localStorage.getItem('visits');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPatient, setEditingPatient] = useState(null);
  
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    middleInitial: '',
    address: '',
    gender: 'Male',
    birthdate: '',
    age: '',
    contact: ''
  });
  
  const [newVisit, setNewVisit] = useState({
    patientId: '',
    visitDate: '',
    symptoms: '',
    diagnosis: '',
    additionalInfo: ''
  });

  const [expandedVisit, setExpandedVisit] = useState(null);
  const [editingVisit, setEditingVisit] = useState(null);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('visits', JSON.stringify(visits));
  }, [visits]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (loginData.accountName === 'admin' && 
        loginData.userId === 'admin' && 
        loginData.password === 'admin123') {
      setIsLoggedIn(true);
      setLoginData({ accountName: '', userId: '', password: '' });
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
    setCurrentPage('home');
  };

  const handleAddPatient = () => {
    if (!newPatient.firstName || !newPatient.lastName || !newPatient.address || !newPatient.birthdate || !newPatient.age || !newPatient.contact) {
      alert('Please fill in all required fields');
      return;
    }
    const patient = {
      id: Date.now(),
      ...newPatient
    };
    setPatients([...patients, patient]);
    setNewPatient({
      firstName: '',
      lastName: '',
      middleInitial: '',
      address: '',
      gender: 'Male',
      birthdate: '',
      age: '',
      contact: ''
    });
    alert('Patient added successfully!');
  };

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleBirthdateChange = (birthdate) => {
    const age = calculateAge(birthdate);
    setNewPatient({...newPatient, birthdate: birthdate, age: age.toString()});
  };

  const handleAddVisit = () => {
    if (!newVisit.patientId || !newVisit.visitDate || !newVisit.symptoms || !newVisit.diagnosis) {
      alert('Please fill in all required fields');
      return;
    }
    const visit = {
      id: Date.now(),
      ...newVisit
    };
    setVisits([...visits, visit]);
    setNewVisit({
      patientId: '',
      visitDate: '',
      symptoms: '',
      diagnosis: '',
      additionalInfo: ''
    });
    alert('Visit recorded successfully!');
  };

  const handleEditVisit = (visit) => {
    setEditingVisit(visit);
    setNewVisit(visit);
    setCurrentPage('editVisit');
  };

  const handleUpdateVisit = () => {
    if (!newVisit.patientId || !newVisit.visitDate || !newVisit.symptoms || !newVisit.diagnosis) {
      alert('Please fill in all required fields');
      return;
    }
    setVisits(visits.map(v => v.id === editingVisit.id ? {...newVisit, id: editingVisit.id} : v));
    setNewVisit({
      patientId: '',
      visitDate: '',
      symptoms: '',
      diagnosis: '',
      additionalInfo: ''
    });
    setEditingVisit(null);
    setCurrentPage('home');
    alert('Visit updated successfully!');
  };

  const handlePrintVisit = (visit) => {
    const patient = patients.find(p => p.id === parseInt(visit.patientId));
    const now = new Date();
    const dateTime = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }) + ', ' + 
                     now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Visit Record - ${patient ? patient.firstName + ' ' + patient.lastName : 'Unknown Patient'}</title>
          <style>
            @media print {
              @page { margin: 0.5in; }
            }
            body { font-family: Arial, sans-serif; padding: 40px; margin: 0; }
            .top-bar { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 14px; }
            .header { margin-bottom: 30px; }
            .header h2 { margin: 0 0 5px 0; color: #1e40af; font-size: 28px; }
            .header p { margin: 0; color: #6b7280; font-size: 16px; }
            h1 { color: #1e40af; border-bottom: 3px solid #1e40af; padding-bottom: 10px; margin: 30px 0 20px 0; font-size: 32px; }
            .info { margin: 20px 0; }
            .label { font-weight: bold; color: #374151; margin-top: 15px; }
            .value { margin-top: 5px; color: #4b5563; }
          </style>
        </head>
        <body>
          <div class="top-bar">
            <div>${dateTime}</div>
            <div>Visit Record - ${patient ? patient.firstName + ' ' + patient.lastName : 'Unknown Patient'}</div>
          </div>
          
          <div class="header">
            <h2>Health Management System</h2>
            <p>Danao City, Cebu</p>
          </div>
          
          <h1>Visit Record</h1>
          
          <div class="info">
            <div class="label">Patient Name:</div>
            <div class="value">${patient ? patient.firstName + ' ' + patient.lastName : 'Unknown Patient'}</div>
            
            <div class="label">Age / Gender:</div>
            <div class="value">${patient ? patient.age + ' years old, ' + patient.gender : 'N/A'}</div>
            
            <div class="label">Contact:</div>
            <div class="value">${patient ? patient.contact : 'N/A'}</div>
            
            <div class="label">Address:</div>
            <div class="value">${patient ? patient.address : 'N/A'}</div>
            
            <div class="label">Visit Date:</div>
            <div class="value">${visit.visitDate}</div>
            
            <div class="label">Symptoms:</div>
            <div class="value">${visit.symptoms}</div>
            
            <div class="label">Diagnosis:</div>
            <div class="value">${visit.diagnosis}</div>
            
            ${visit.additionalInfo ? `
              <div class="label">Additional Information:</div>
              <div class="value">${visit.additionalInfo}</div>
            ` : ''}
          </div>
          <script>
            window.onload = function() { 
              setTimeout(function() { window.print(); }, 250);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDeletePatient = (id) => {
<<<<<<< HEAD
  if (window.confirm('Are you sure you want to delete this patient? All associated visits will also be deleted.')) {
    setPatients(patients.filter(p => p.id !== id));
    setVisits(visits.filter(v => v.patientId !== id.toString()));
  }
};
=======
    if (window.confirm('Are you sure you want to delete this patient?')) {
      setPatients(patients.filter(p => p.id !== id));
    }
  };
>>>>>>> 96da67ed9a9cebbb0444020586cecb587c1553f7

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setNewPatient(patient);
    setCurrentPage('editPatient');
  };

  const handleUpdatePatient = () => {
    if (!newPatient.firstName || !newPatient.lastName || !newPatient.address || !newPatient.birthdate || !newPatient.age || !newPatient.contact) {
      alert('Please fill in all required fields');
      return;
    }
    setPatients(patients.map(p => p.id === editingPatient.id ? {...newPatient, id: editingPatient.id} : p));
    setNewPatient({
      firstName: '',
      lastName: '',
      middleInitial: '',
      address: '',
      gender: 'Male',
      birthdate: '',
      age: '',
      contact: ''
    });
    setEditingPatient(null);
    setCurrentPage('viewPatients');
    alert('Patient updated successfully!');
  };

  const filteredPatients = patients.filter(patient =>
    patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentVisits = visits.slice(-5).reverse();

  if (!isLoggedIn) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-cyan-400 via-blue-400 to-blue-500">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M35 30 Q42.5 22.5 50 30 L50 50 Q57.5 57.5 50 65 L35 50 Q27.5 42.5 35 30Z" fill="#0D7C7C" stroke="#0D7C7C" strokeWidth="1"/>
                <rect x="29" y="37.5" width="10" height="22.5" fill="#0D7C7C"/>
                <rect x="29" y="47.5" width="22.5" height="10" fill="#0D7C7C"/>
                <circle cx="62.5" cy="52.5" r="6" fill="#F5A623" stroke="#F5A623" strokeWidth="1"/>
                <path d="M50 30 Q70 15 72.5 52.5" stroke="#0D7C7C" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <rect x="50" y="50" width="12.5" height="30" fill="#F5A623"/>
              </svg>
              <div>
                <h1 className="text-3xl font-bold text-teal-700">Medical Care</h1>
                <p className="text-sm text-teal-600">Medical Center</p>
              </div>
            </div>

            <div className="bg-gradient-to-b from-blue-400 to-blue-500 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-semibold text-white text-center mb-6">Sign In</h2>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Account Name"
                    value={loginData.accountName}
                    onChange={(e) => setLoginData({...loginData, accountName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="User ID"
                    value={loginData.userId}
                    onChange={(e) => setLoginData({...loginData, userId: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {loginError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-xl text-sm">
                    {loginError}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-white">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    Remember me
                  </label>
                  <button type="button" className="hover:underline">
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-blue-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all shadow-lg"
                >
                  Log In
                </button>

                <div className="text-center text-sm text-white">
                  Can't access your account?
                </div>
              </form>
            </div>

            <div className="mt-6 bg-white/90 backdrop-blur rounded-xl p-4 text-sm text-gray-700">
              <p className="font-semibold mb-2">Default Login Credentials:</p>
              <p>Account Name: <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin</span></p>
              <p>User ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin</span></p>
              <p>Password: <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin123</span></p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 items-center justify-center p-8 relative">
          <div className="relative w-full max-w-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-400 rounded-full opacity-10 blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="bg-white rounded-3xl p-16 shadow-2xl">
                <svg className="w-96 h-96" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M70 60 Q85 45 100 60 L100 100 Q115 115 100 130 L70 100 Q55 85 70 60Z" fill="#0D7C7C" stroke="#0D7C7C" strokeWidth="2"/>
                  <rect x="58" y="75" width="20" height="45" fill="#0D7C7C"/>
                  <rect x="58" y="95" width="45" height="20" fill="#0D7C7C"/>
                  <circle cx="125" cy="105" r="12" fill="#F5A623" stroke="#F5A623" strokeWidth="2"/>
                  <path d="M100 60 Q140 30 145 105" stroke="#0D7C7C" strokeWidth="4" fill="none" strokeLinecap="round"/>
                  <rect x="100" y="100" width="25" height="60" fill="#F5A623"/>
                  <text x="100" y="170" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#0D7C7C" textAnchor="middle">MEDICAL CARE</text>
                  <text x="100" y="190" fontFamily="Arial, sans-serif" fontSize="14" fill="#0D7C7C" textAnchor="middle">Medical Center</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100">
      <div className="w-72 bg-gradient-to-b from-blue-900 to-blue-800 text-white p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-lg text-blue-200">Health Management System</p>
          <p className="text-sm text-blue-300 mt-2">Danao City, Cebu</p>
        </div>

        <nav className="flex-1 space-y-3">
          <button
            onClick={() => setCurrentPage('home')}
            className={`w-full text-left px-6 py-3 rounded-lg transition-all ${
              currentPage === 'home'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg'
                : 'bg-blue-700 hover:bg-blue-600'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentPage('viewPatients')}
            className={`w-full text-left px-6 py-3 rounded-lg transition-all ${
              currentPage === 'viewPatients'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg'
                : 'bg-blue-700 hover:bg-blue-600'
            }`}
          >
            View All Patients
          </button>
          <button
            onClick={() => setCurrentPage('addPatient')}
            className={`w-full text-left px-6 py-3 rounded-lg transition-all ${
              currentPage === 'addPatient'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg'
                : 'bg-blue-700 hover:bg-blue-600'
            }`}
          >
            Add New Patient
          </button>
          <button
            onClick={() => setCurrentPage('addVisit')}
            className={`w-full text-left px-6 py-3 rounded-lg transition-all ${
              currentPage === 'addVisit'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg'
                : 'bg-blue-700 hover:bg-blue-600'
            }`}
          >
            Add New Visit
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all mt-4"
        >
          Log Out
        </button>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 min-h-full">
          {currentPage === 'home' && (
            <div>
              <h2 className="text-4xl font-bold text-blue-900 mb-6">Dashboard Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg opacity-90 mb-2">Total Patients</h3>
                  <p className="text-4xl font-bold">{patients.length}</p>
                </div>
                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg opacity-90 mb-2">Total Visits</h3>
                  <p className="text-4xl font-bold">{visits.length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg opacity-90 mb-2">This Week</h3>
                  <p className="text-4xl font-bold">{visits.filter(v => {
                    const visitDate = new Date(v.visitDate);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return visitDate >= weekAgo;
                  }).length}</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Recent Visits</h3>
                {recentVisits.length === 0 ? (
                  <p className="text-gray-500">No visits recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {recentVisits.map(visit => {
                      const patient = patients.find(p => p.id === parseInt(visit.patientId));
                      const isExpanded = expandedVisit === visit.id;
                      return (
                        <div key={visit.id} className="bg-white rounded-lg shadow">
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setExpandedVisit(isExpanded ? null : visit.id)}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <svg className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </button>
                                  <div>
                                    <p className="font-semibold text-blue-900">
                                      {patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {patient ? `${patient.age} years old, ${patient.gender}` : ''}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <p className="text-sm text-gray-500">{visit.visitDate}</p>
                                <button
                                  onClick={() => handlePrintVisit(visit)}
                                  className="text-green-600 hover:text-green-800"
                                  title="Print"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleEditVisit(visit)}
                                  className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  Edit
                                </button>
                              </div>
                            </div>
                            
                            {isExpanded && (
                              <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                                <div>
                                  <p className="font-medium text-gray-700">Symptoms:</p>
                                  <p className="text-gray-600">{visit.symptoms}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-700">Diagnosis:</p>
                                  <p className="text-gray-600">{visit.diagnosis}</p>
                                </div>
                                {visit.additionalInfo && (
                                  <div>
                                    <p className="font-medium text-gray-700">Additional Info:</p>
                                    <p className="text-gray-600">{visit.additionalInfo}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentPage === 'viewPatients' && (
            <div>
              <h2 className="text-4xl font-bold text-blue-600 mb-6">Patients List</h2>
              
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Search by name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-4 py-3 font-semibold text-gray-700">First Name</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Last Name</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Gender</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Age</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Contact</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                          No patients found.
                        </td>
                      </tr>
                    ) : (
                      filteredPatients.map(patient => (
                        <tr key={patient.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{patient.firstName}</td>
                          <td className="px-4 py-3">{patient.lastName}</td>
                          <td className="px-4 py-3">{patient.gender}</td>
                          <td className="px-4 py-3">{patient.age}</td>
                          <td className="px-4 py-3">{patient.contact}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleEditPatient(patient)}
                              className="text-blue-600 hover:text-blue-800 font-medium mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePatient(patient.id)}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentPage === 'addPatient' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold text-blue-600 mb-3 text-center">Add New Patient</h2>
              <p className="text-gray-600 text-center mb-8">Fill in the details below to add a new patient.</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">First Name:</label>
                  <input
                    type="text"
                    value={newPatient.firstName}
                    onChange={(e) => setNewPatient({...newPatient, firstName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Last Name:</label>
                  <input
                    type="text"
                    value={newPatient.lastName}
                    onChange={(e) => setNewPatient({...newPatient, lastName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Middle Initial:</label>
                  <input
                    type="text"
                    maxLength="1"
                    value={newPatient.middleInitial}
                    onChange={(e) => setNewPatient({...newPatient, middleInitial: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Address:</label>
                  <input
                    type="text"
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Gender:</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Birthdate:</label>
                  <input
                    type="date"
                    value={newPatient.birthdate}
                    onChange={(e) => handleBirthdateChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Age:</label>
                  <input
                    type="number"
                    value={newPatient.age}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Contact Number:</label>
                  <input
                    type="tel"
                    value={newPatient.contact}
                    onChange={(e) => setNewPatient({...newPatient, contact: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={handleAddPatient}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Add Patient
                </button>

                <button
                  onClick={() => setCurrentPage('viewPatients')}
                  className="w-full text-blue-600 hover:text-blue-800 font-medium py-2"
                >
                  Back to Patients List
                </button>
              </div>
            </div>
          )}

          {currentPage === 'editPatient' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold text-blue-600 mb-3 text-center">Edit Patient</h2>
              <p className="text-gray-600 text-center mb-8">Update the patient information below.</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">First Name:</label>
                  <input
                    type="text"
                    value={newPatient.firstName}
                    onChange={(e) => setNewPatient({...newPatient, firstName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Last Name:</label>
                  <input
                    type="text"
                    value={newPatient.lastName}
                    onChange={(e) => setNewPatient({...newPatient, lastName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Middle Initial:</label>
                  <input
                    type="text"
                    maxLength="1"
                    value={newPatient.middleInitial}
                    onChange={(e) => setNewPatient({...newPatient, middleInitial: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Address:</label>
                  <input
                    type="text"
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Gender:</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Birthdate:</label>
                  <input
                    type="date"
                    value={newPatient.birthdate}
                    onChange={(e) => handleBirthdateChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Age:</label>
                  <input
                    type="number"
                    value={newPatient.age}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Contact Number:</label>
                  <input
                    type="tel"
                    value={newPatient.contact}
                    onChange={(e) => setNewPatient({...newPatient, contact: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={handleUpdatePatient}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Update Patient
                </button>

                <button
                  onClick={() => {
                    setEditingPatient(null);
                    setNewPatient({
                      firstName: '',
                      lastName: '',
                      middleInitial: '',
                      address: '',
                      gender: 'Male',
                      birthdate: '',
                      age: '',
                      contact: ''
                    });
                    setCurrentPage('viewPatients');
                  }}
                  className="w-full text-blue-600 hover:text-blue-800 font-medium py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {currentPage === 'editVisit' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold text-blue-600 mb-3 text-center">Edit Visit</h2>
              <p className="text-gray-600 text-center mb-8">Update the visit information below.</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Select Patient:</label>
                  <select
                    value={newVisit.patientId}
                    onChange={(e) => setNewVisit({...newVisit, patientId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">-- Select a patient --</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Visit Date:</label>
                  <input
                    type="date"
                    value={newVisit.visitDate}
                    onChange={(e) => setNewVisit({...newVisit, visitDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Symptoms:</label>
                  <textarea
                    rows="4"
                    value={newVisit.symptoms}
                    onChange={(e) => setNewVisit({...newVisit, symptoms: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Diagnosis:</label>
                  <textarea
                    rows="4"
                    value={newVisit.diagnosis}
                    onChange={(e) => setNewVisit({...newVisit, diagnosis: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Additional Info:</label>
                  <textarea
                    rows="3"
                    value={newVisit.additionalInfo}
                    onChange={(e) => setNewVisit({...newVisit, additionalInfo: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={handleUpdateVisit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Update Visit
                </button>

                <button
                  onClick={() => {
                    setEditingVisit(null);
                    setNewVisit({
                      patientId: '',
                      visitDate: '',
                      symptoms: '',
                      diagnosis: '',
                      additionalInfo: ''
                    });
                    setCurrentPage('home');
                  }}
                  className="w-full text-blue-600 hover:text-blue-800 font-medium py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {currentPage === 'addVisit' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold text-blue-600 mb-3 text-center">Add New Health Visit</h2>
              <p className="text-gray-600 text-center mb-8">Fill in the details below to add a new visit for the patient.</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Select Patient:</label>
                  <select
                    value={newVisit.patientId}
                    onChange={(e) => setNewVisit({...newVisit, patientId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">-- Select a patient --</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Visit Date:</label>
                  <input
                    type="date"
                    value={newVisit.visitDate}
                    onChange={(e) => setNewVisit({...newVisit, visitDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Symptoms:</label>
                  <textarea
                    rows="4"
                    value={newVisit.symptoms}
                    onChange={(e) => setNewVisit({...newVisit, symptoms: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Diagnosis:</label>
                  <textarea
                    rows="4"
                    value={newVisit.diagnosis}
                    onChange={(e) => setNewVisit({...newVisit, diagnosis: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Additional Info:</label>
                  <textarea
                    rows="3"
                    value={newVisit.additionalInfo}
                    onChange={(e) => setNewVisit({...newVisit, additionalInfo: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={handleAddVisit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Add Visit
                </button>

                <button
                  onClick={() => setCurrentPage('home')}
                  className="w-full text-blue-600 hover:text-blue-800 font-medium py-2"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}