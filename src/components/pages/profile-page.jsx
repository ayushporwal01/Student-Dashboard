import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, Calendar, GraduationCap, Edit, Save, X, Camera } from "lucide-react";



export function ProfilePage({ userData, onUpdateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    ...userData,
    phone: userData.phone || "+917669654860" // Updated default phone format
  });
  const [errors, setErrors] = useState({}); // Add state for validation errors


  // Define course options with college courses
  const courseOptions = [
    { value: "none", label: "None" }, // Changed from empty string to "none"
    // Arts Courses
    { value: "ba-english", label: "B.A. (English Literature)" },
    { value: "ba-history", label: "B.A. (History)" },
    { value: "ba-political-science", label: "B.A. (Political Science)" },
    { value: "ba-economics", label: "B.A. (Economics)" },
    { value: "ba-psychology", label: "B.A. (Psychology)" },
    { value: "ba-sociology", label: "B.A. (Sociology)" },
    { value: "ba-philosophy", label: "B.A. (Philosophy)" },
    { value: "ba-journalism", label: "B.A. (Journalism & Mass Communication)" },
    { value: "ba-geography", label: "B.A. (Geography)" },
    
    // Science Courses (B.Sc.)
    { value: "bsc-general", label: "Science (B.Sc.)" },
    { value: "bsc-mathematics", label: "B.Sc. (Mathematics)" },
    { value: "bsc-physics", label: "B.Sc. (Physics)" },
    { value: "bsc-chemistry", label: "B.Sc. (Chemistry)" },
    { value: "bsc-biology", label: "B.Sc. (Biology)" },
    { value: "bca", label: "BCA (Bachelor of Computer Applications)" }, // BCA
    { value: "bsc-computer-science", label: "B.Sc. (Computer Science)" },
    { value: "bsc-electronics", label: "B.Sc. (Electronics)" },
    { value: "bsc-statistics", label: "B.Sc. (Statistics)" },
    { value: "bsc-environmental-science", label: "B.Sc. (Environmental Science)" },
    { value: "bsc-biotechnology", label: "B.Sc. (Biotechnology)" },
    
    // Commerce & Management Courses
    { value: "bcom-general", label: "B.Com (General)" },
    { value: "bcom-honours", label: "B.Com (Honours)" },
    { value: "bba", label: "BBA (Bachelor of Business Administration)" },
    { value: "bbm", label: "BBM (Bachelor of Business Management)" },
    { value: "bsw", label: "BSW (Bachelor of Social Work)" },
    { value: "bfa", label: "BFA (Bachelor of Fine Arts)" },
    { value: "bjmc", label: "BJMC (Bachelor of Journalism & Mass Communication)" },
    
    // Law & Education Courses
    { value: "llb", label: "LLB (Bachelor of Law – 3 Year)" },
    { value: "bed", label: "B.Ed (Bachelor of Education)" },
    
    // Master's Courses - Arts
    { value: "ma-english", label: "M.A. (English Literature)" },
    { value: "ma-history", label: "M.A. (History)" },
    { value: "ma-political-science", label: "M.A. (Political Science)" },
    { value: "ma-economics", label: "M.A. (Economics)" },
    { value: "ma-psychology", label: "M.A. (Psychology)" },
    { value: "ma-sociology", label: "M.A. (Sociology)" },
    { value: "ma-philosophy", label: "M.A. (Philosophy)" },
    { value: "ma-journalism", label: "M.A. (Journalism & Mass Communication)" },
    { value: "ma-geography", label: "M.A. (Geography)" },
    
    // Master's Courses - Science (M.Sc.)
    { value: "msc-general", label: "Science (M.Sc.)" },
    { value: "msc-mathematics", label: "M.Sc. (Mathematics)" },
    { value: "msc-physics", label: "M.Sc. (Physics)" },
    { value: "msc-chemistry", label: "M.Sc. (Chemistry)" },
    { value: "msc-biology", label: "M.Sc. (Biology)" },
    { value: "msc-computer-science", label: "M.Sc. (Computer Science)" },
    { value: "msc-electronics", label: "M.Sc. (Electronics)" },
    { value: "msc-statistics", label: "M.Sc. (Statistics)" },
    { value: "msc-environmental-science", label: "M.Sc. (Environmental Science)" },
    { value: "msc-biotechnology", label: "M.Sc. (Biotechnology)" },
    
    // Master's Courses - Commerce & Management
    { value: "mcom", label: "M.Com (Master of Commerce)" },
    { value: "mba", label: "MBA (Master of Business Administration)" },
    { value: "mfm", label: "MFM (Master of Financial Management)" },
    { value: "mca", label: "MCA (Master of Computer Applications)" },
    { value: "msw", label: "MSW (Master of Social Work)" },
    { value: "mfa", label: "MFA (Master of Fine Arts)" },
    { value: "mjmc", label: "MJMC (Master of Journalism & Mass Communication)" },
    
    // Master's Courses - Law & Education
    { value: "llm", label: "LLM (Master of Law)" },
    { value: "med", label: "M.Ed (Master of Education)" },
  ];

  // Calculate current semester based on academic year and current date
  const calculateCurrentSemester = useCallback((academicYear) => {
    // For the specific academic year 2023-2026, always return "3rd" year
    if (academicYear === "2023-2026") {
      return "3rd";
    }
    
    if (!academicYear) return "3rd";
    
    const parts = academicYear.split('-');
    if (parts.length !== 2) return "3rd";
    
    const startYear = parseInt(parts[0]);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-11 (Jan-Dec)
    
    // For academic year 2023-2026, we want to show 3rd year in 2025
    // Calculate the academic year (1st, 2nd, 3rd, 4th) based on the start year
    let academicYearNumber = currentYear - startYear;
    
    // Adjust for academic year starting in June
    if (currentMonth < 5) { // Before June
      academicYearNumber -= 1;
    }
    
    // Add 1 because academic years start at 1st year
    const year = Math.min(Math.max(1, academicYearNumber + 1), 4);
    
    return `${year}${getOrdinalSuffix(year)}`;
  }, []);
  
  // Helper function to get ordinal suffix
  const getOrdinalSuffix = (number) => {
    if (number > 3 && number < 21) return 'th';
    switch (number % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };



  // Sync formData with userData when userData changes
  useEffect(() => {
    setFormData(userData);
  }, [userData]);



  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updatedData = {
        ...prev,
        [field]: value
      };
      
      // Clear error for this field when user starts typing
      if (errors[field]) {
        setErrors(prevErrors => {
          const newErrors = { ...prevErrors };
          delete newErrors[field];
          return newErrors;
        });
      }
      
      // If academic year is changed, update expected graduation
      if (field === 'academicYear') {
        const parts = value.split('-');
        if (parts.length === 2) {
          updatedData.expectedGraduation = parts[1]; // Use the year after the hyphen
        }
      }
      
      // If course value is changed, update course name
      if (field === 'courseValue') {
        // Handle the "none" case specifically
        if (value === "none") {
          updatedData.course = "None";
          updatedData.courseValue = "none";
        } else {
          const selectedCourse = courseOptions.find(option => option.value === value);
          if (selectedCourse) {
            updatedData.course = selectedCourse.label;
            updatedData.courseValue = value;
          }
        }
      }
      
      return updatedData;
    });
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        return value.trim() ? '' : `${field === 'firstName' ? 'First' : 'Last'} name is required`;
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!value.includes('@')) return 'Please enter a valid email address';
        return '';
      case 'phone':
        // Updated regex for the new phone format +917669654860
        const phoneRegex = /^\+91\d{10}$/;
        if (!value.trim()) return 'Phone number is required';
        if (!phoneRegex.test(value)) return 'Please enter a valid phone number in +917669654860 format';
        return '';
      case 'academicYear':
        const academicYearRegex = /^\d{4}-\d{4}$/;
        if (!value.trim()) return 'Academic year is required';
        if (!academicYearRegex.test(value)) return 'Please enter a valid academic year in YYYY-YYYY format';
        return '';
      case 'courseValue':
        return value && value !== "none" ? '' : 'Please select your course';
      default:
        return '';
    }
  };

  const handleSave = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate all fields
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'academicYear', 'courseValue'];
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    
    // If validation fails, show error message
    if (!isValid) {
      alert('Please fix the errors in the form before saving.');
      return;
    }
    
    // Ensure we preserve all original userData fields and only update changed ones
    const updatedData = {
      ...userData, // Start with original data
      ...formData  // Override with form data
    };
    
    // Update the shared user data
    onUpdateUser(updatedData);
    console.log('Saving profile data:', updatedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData(userData);
    setIsEditing(false);
  };

  // Add the missing handleImageUpload function
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };



  return (
    <div className="pt-6 space-y-4 route-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 montserrat-font">
            My Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your personal information and account settings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile Picture and Basic Info */}
        <Card className="glass-card border-white/30">
          <CardContent className="p-5 text-center">
            <div className="relative inline-block">
              <Avatar className={`h-20 w-20 mx-auto mb-3 ring-4 ring-primary/20 ${isEditing ? 'brightness-75' : ''}`}>
                <AvatarImage
                  src={formData.avatar || "/default-img.png"}
                  alt={`${formData.firstName} ${formData.lastName}`}
                  className={isEditing ? 'brightness-75' : ''}
                />
                <AvatarFallback className={`bg-primary text-primary-foreground text-xl ${isEditing ? 'brightness-75' : ''}`}>
                  {formData.firstName[0]}{formData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              
              {/* Camera Icon Overlay - Only show in edit mode */}
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <label
                    htmlFor="avatar-upload"
                    className="flex items-center justify-center w-12 h-12 bg-primary rounded-full shadow-lg cursor-pointer"
                  >
                    <Camera className="h-6 w-6 text-primary-foreground" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="First Name"
                    className="text-center"
                  />
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Last Name"
                    className="text-center"
                  />
                </div>
                <p className="text-muted-foreground text-sm">{formData.studentId}</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground mb-4">{formData.studentId}</p>
              </>
            )}
            {isEditing ? (
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="glass-card border-white/30 lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                {isEditing ? (
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="Email address"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white/30 border border-white/20">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-base text-foreground">{formData.email}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                {isEditing ? (
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600" />
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="+917669654860" // Updated placeholder
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white/30 border border-white/20">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span className="text-base text-foreground">{formData.phone}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Course</label>
                {isEditing ? (
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600" />
                    <Select 
                      value={formData.courseValue || "none"}
                      onValueChange={(value) => handleInputChange('courseValue', value)}
                    >
                      <SelectTrigger className={`pl-10 ${errors.courseValue ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courseOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.courseValue && <p className="text-red-500 text-xs mt-1">{errors.courseValue}</p>}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white/30 border border-white/20">
                    <GraduationCap className="h-4 w-4 text-blue-600" />
                    <span className="text-base text-foreground">{formData.course || "None"}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Academic Year</label>
                {isEditing ? (
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600" />
                    <Input
                      value={formData.academicYear}
                      onChange={(e) => handleInputChange('academicYear', e.target.value)}
                      className={`pl-10 ${errors.academicYear ? 'border-red-500' : ''}`}
                      placeholder="Academic year (YYYY-YYYY)"
                    />
                    {errors.academicYear && <p className="text-red-500 text-xs mt-1">{errors.academicYear}</p>}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white/30 border border-white/20">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-base text-foreground">{formData.academicYear}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Academic Information */}
      <Card className="glass-card border-white/30">
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Academic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/30 border border-white/20">
              <div>
                <h4 className="font-medium text-base text-foreground">Current Year</h4>
                <p className="text-sm text-muted-foreground">
                  {isEditing ? "Based on academic year" : "Fall 2025"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold text-primary">
                  {isEditing 
                    ? calculateCurrentSemester(formData.academicYear) 
                    : calculateCurrentSemester(userData.academicYear)}
                </p>
                <p className="text-sm text-muted-foreground">Year</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/30 border border-white/20">
              <div>
                <h4 className="font-medium text-base text-foreground">Expected Graduation</h4>
                <p className="text-sm text-muted-foreground">Estimated Date</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold text-purple-600">
                  {isEditing 
                    ? formData.academicYear.split('-')[1] || "2026"
                    : userData.academicYear.split('-')[1] || "2026"}
                </p>
                <p className="text-sm text-muted-foreground">Year</p>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}