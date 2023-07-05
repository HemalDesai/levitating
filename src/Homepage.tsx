import React, { useState, useEffect } from "react";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { useNavigate } from "react-router-dom";

interface MultiStepFormProps {
  token: string;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ token }) => {
  const [apiResponse, setApiResponse] = useState("");
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });
  const [addressError, setAddressError] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [geolocationStatus, setGeolocationStatus] = useState("Fetching...");
  const [geolocation, setGeolocation] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    // Check if the token is null or empty
    if (!token) {
      // Redirect to the login page
      navigate("/login"); // Replace "/login" with the actual login page route
    }
  }, [token, history]);

  const validateStep1 = () => {
    let isValid = true;

    if (name.trim() === "") {
      setNameError("*Please enter a name");
      isValid = false;
    }

    if (email.trim() === "") {
      setEmailError("*Please enter an email");
      isValid = false;
    }

    if (!phone) {
      setPhoneError("*Please enter a phone number");
      isValid = false;
    }

    return isValid;
  };

  const validateStep2 = () => {
    let isValid = true;
    const errors = {
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    };

    if (address.line1.trim() === "") {
      errors.line1 = "*Please enter Address Line 1";
      isValid = false;
    }

    if (address.line2.trim() === "") {
      errors.line2 = "*Please enter Address Line 2";
      isValid = false;
    }

    if (address.city.trim() === "") {
      errors.city = "*Please enter City";
      isValid = false;
    }

    if (address.state.trim() === "") {
      errors.state = "*Please enter State";
      isValid = false;
    }

    if (address.pincode.trim() === "") {
      errors.pincode = "*Please enter Pincode";
      isValid = false;
    }

    if (address.country.trim() === "") {
      errors.country = "*Please enter Country";
      isValid = false;
    }

    setAddressError(errors);

    return isValid;
  };

  const validateStep3 = () => {
    let isValid = true;

    if (files.length === 0) {
      isValid = false;
      // Set the error message for file upload
      // Example:
      setFileError("*Please select a file");
    }

    return isValid;
  };

  const handleNext = () => {
    if (step === 1) {
      const isValid = validateStep1();
      if (isValid) {
        setStep((prevStep) => prevStep + 1);
      }
    } else if (step === 2) {
      // Validate step 2 fields
      const isValid = validateStep2();
      if (isValid) {
        setStep((prevStep) => prevStep + 1);
      }
      // ...
    } else if (step === 3) {
      // Validate step 3 fields
      const isValid = validateStep3();
      if (isValid) {
        setStep((prevStep) => prevStep + 1);
      }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const geolocationString = `Latitude: ${latitude}, Longitude: ${longitude}`;
            setGeolocation(geolocationString);
            setGeolocationStatus("Geolocation captured");
            // setStep((prevStep) => prevStep + 1);
          },
          
        );
      } else {
        setGeolocationStatus("Geolocation not supported");
        // setStep((prevStep) => prevStep + 1);
      }
      // ...
    } 
    else if (step === 4) {
      // Request geolocation when moving to Step 4
      setStep((prevStep) => prevStep + 1);
      
    } else {
      //   setStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    // Create a new FormData object
    const formData = new FormData();

    // Append the form data to the FormData object
    formData.append("pincode", address.pincode);
    formData.append("geolocation", geolocation);
    formData.append("address_1", address.line1);
    formData.append("address_2", address.line2);
    formData.append("city", address.city);
    formData.append("name", name);
    formData.append("state", address.state);
    formData.append("country", address.country);
    formData.append("phone_number", phone);
    formData.append("email", email);

    // Append the single file with the correct field name
    formData.append("single_file", files[0]);

    // Append the multiple files with the correct field name
    files.forEach((file, index) => {
      formData.append(`multi_ups${index + 1}`, file);
    });

    // Make the API request
    fetch("https://x8ki-letl-twmt.n7.xano.io/api:XooRuQbs/form", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token, // Replace with your actual auth token
      },
      body: formData,
    })
      .then((response) => response.json())
      .then(() => {
        // Handle the API response here
        setApiResponse("Form submitted successfully!🎉");
        // Display the API response to the user
        // alert(JSON.stringify(data));

        // Reset the form state if needed
        setStep(5);
        setName("");
        setEmail("");
        setPhone("");
        setAddress({
          line1: "",
          line2: "",
          city: "",
          state: "",
          pincode: "",
          country: "",
        });
        setFiles([]);
        setGeolocationStatus("");
        setGeolocation("");
      })
      .catch((error) => {
        // Handle any errors that occurred during the API request
        console.error("Error submitting form:", error);
      });
  };
  const handlePhoneChange = (value: string) => {
    setPhone(value);
    setPhoneError("");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div >
            <h2 className="text-xl font-bold mb-4">Step 1: Basic Details</h2>
            <input
              className="border border-gray-300 rounded-md px-3 py-2 mb-5  w-full"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
            />

            <input
              className="border border-gray-300 rounded-md px-3 mb-5 py-2  w-full"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              onBlur={handleEmailValidation}
            />

            <PhoneInput
              country={"in"}
              value={phone}
              onChange={handlePhoneChange}
            />
            {nameError && <p className="text-red-500 mt-5">{nameError}</p>}
            {emailError && <p className="text-red-500 ">{emailError}</p>}
            {phoneError && <p className="text-red-500 ">{phoneError}</p>}
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold">Step 2: Address</h2>

            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2">
                <input
                  className="border border-gray-300 rounded-md px-3 py-2 mt-4 w-full"
                  type="text"
                  placeholder="Address Line 1"
                  value={address.line1}
                  onChange={(e) => {
                    setAddress((prevAddress) => ({
                      ...prevAddress,
                      line1: e.target.value,
                    }));
                    setAddressError((prevErrors) => ({
                      ...prevErrors,
                      line1: "",
                    }));
                  }}
                />
                {addressError.line1 && (
                  <p className="text-red-500">{addressError.line1}</p>
                )}
              </div>

              <div className="w-full md:w-1/2 px-2">
                <input
                  className="border border-gray-300 rounded-md px-3 py-2 mt-4 w-full"
                  type="text"
                  placeholder="Address Line 2"
                  value={address.line2}
                  onChange={(e) => {
                    setAddress((prevAddress) => ({
                      ...prevAddress,
                      line2: e.target.value,
                    }));
                    setAddressError((prevErrors) => ({
                      ...prevErrors,
                      line2: "",
                    }));
                  }}
                />
                {addressError.line2 && (
                  <p className="text-red-500">{addressError.line2}</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2">
                <input
                  className="border border-gray-300 rounded-md px-3 py-2 mt-4 w-full"
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => {
                    setAddress((prevAddress) => ({
                      ...prevAddress,
                      city: e.target.value,
                    }));
                    setAddressError((prevErrors) => ({
                      ...prevErrors,
                      city: "",
                    }));
                  }}
                />
                {addressError.city && (
                  <p className="text-red-500">{addressError.city}</p>
                )}
              </div>

              <div className="w-full md:w-1/2 px-2">
                <input
                  className="border border-gray-300 rounded-md px-3 py-2 mt-4 w-full"
                  type="text"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => {
                    setAddress((prevAddress) => ({
                      ...prevAddress,
                      state: e.target.value,
                    }));
                    setAddressError((prevErrors) => ({
                      ...prevErrors,
                      state: "",
                    }));
                  }}
                />
                {addressError.state && (
                  <p className="text-red-500">{addressError.state}</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2">
                <input
                  className="border border-gray-300 rounded-md px-3 py-2 mt-4 w-full"
                  type="text"
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(e) => {
                    setAddress((prevAddress) => ({
                      ...prevAddress,
                      pincode: e.target.value,
                    }));
                    setAddressError((prevErrors) => ({
                      ...prevErrors,
                      pincode: "",
                    }));
                  }}
                />
                {addressError.pincode && (
                  <p className="text-red-500">{addressError.pincode}</p>
                )}
              </div>

              <div className="w-full md:w-1/2 px-2">
                <input
                  className="border border-gray-300 rounded-md px-3 py-2 mt-4 w-full"
                  type="text"
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) =>
                    setAddress((prevAddress) => ({
                      ...prevAddress,
                      country: e.target.value,
                    }))
                  }
                />
                {addressError.country && (
                  <p className="text-red-500">{addressError.country}</p>
                )}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Step 3: File Upload</h2>
            <input
              className="border border-gray-300 rounded-md px-3 py-2 mb-3 w-full"
              type="file"
              accept=".png,.pdf"
              onChange={(e) => setFiles([e.target.files![0]])}
            />
            {fileError && <p className="text-red-500">{fileError}</p>}
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Step 4: Multi File Upload
            </h2>
            <input
              className="border border-gray-300 rounded-md px-3 py-2 mb-3 w-full"
              type="file"
              accept=".png,.pdf"
              multiple
              onChange={(e) => setFiles([...e.target.files!])}
            />
            <p className="mb-3">Geolocation Status: {geolocationStatus}</p>
            {geolocation && <p>Geolocation: {geolocation}</p>}
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Step 5: Status</h2>
            <p>Form filled successfully!</p>
            {apiResponse && <p>{apiResponse}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  const handleEmailValidation = () => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
    }
  };

  return (
    <div className="flex bg-gray-100 justify-center items-center h-screen"
     style={{
        backgroundColor: "#99afff",
        backgroundImage:
          "radial-gradient(at 20% 33%, hsla(149,98%,77%,1) 0px, transparent 50%),\nradial-gradient(at 13% 89%, hsla(270,95%,77%,1) 0px, transparent 50%),\nradial-gradient(at 40% 87%, hsla(305,73%,72%,1) 0px, transparent 50%),\nradial-gradient(at 53% 95%, hsla(158,74%,60%,1) 0px, transparent 50%),\nradial-gradient(at 80% 47%, hsla(327,92%,66%,1) 0px, transparent 50%),\nradial-gradient(at 43% 5%, hsla(348,69%,75%,1) 0px, transparent 50%),\nradial-gradient(at 60% 65%, hsla(133,63%,67%,1) 0px, transparent 50%)",
      }}>
      <div className="max-w-lg mx-auto bg-blue-50 rounded-md  p-5">
        {renderStep()}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={handlePrevious}
            >
              Previous
            </button>
          )}
          {step < 5 ? (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={handleSubmit}
            >
              Submit
            </button>
          )}
        </div>
        <div className="flex justify-center mt-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className={`w-4 h-4 rounded-full mx-1 ${
                  item <= step ? "bg-blue-500" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className={`w-20 ${
                  item <= step ? "text-blue-500" : "text-gray-500"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
