import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import Link from 'next/link';

function  Home() {
  return (
    <div>
    <div className="container mt-5">
      <div className="text-center">
        <h1 className="display-4 text-primary">Hello !</h1>
        <p className="lead">
          This is a website created to practice my coding skills.
        </p>
      </div>

      <div className="mt-5">
      <Link href="/login">
        <button className="btn btn-primary">Go to Login</button>  
      </Link>
      </div>
    </div>
    </div>
  );
};

export default Home;
