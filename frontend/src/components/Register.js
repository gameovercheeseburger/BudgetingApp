'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { createUser } from '../actions/authActions';

const Register = () => {
  const [state, formAction] = useFormState(createUser, null);
  const { pending } = useFormStatus();

  return (
    <div className="intro">
      <div>
        <h1>Take Control of <span className="accent">Your Money</span></h1>
        <p>Personal budgeting is the secret to financial success. Sign up today!</p>
        <form action={formAction}>
          <label>Enter Name</label>
          <input 
            type="text" 
            name="userName" 
            placeholder="Enter name" 
            aria-label="Your Name" 
            autoComplete="given-name" 
            required
          />
          <label>Enter Email</label>
          <input 
            type="email" 
            name="email" 
            placeholder="Enter email" 
            aria-label="Your Email" 
            autoComplete="email" 
            required
          />
          <label>Enter Password</label>
          <input 
            type="password" 
            name="password" 
            placeholder="Enter password" 
            aria-label="Your Password" 
            autoComplete="chosen-password" 
            required
          />
          <button 
            type="submit" 
            className="btn btn--dark"
            disabled={pending}
          >
            {pending ? 
              <span>Creating User...</span> 
            : (
              <>
                <span>Create New User</span>
                <PlusCircleIcon width={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;