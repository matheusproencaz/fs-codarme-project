import { useFormik } from 'formik';
import * as yup from 'yup';
import 'axios';
import axios from 'axios';
import { useState } from 'react';


const Input = props => (
  <input {...props} className="w-full bg-transparent p-4 border rounded-xl border-onix text-lg outline-none focus:border-platinium"/>
)

const validationSchema = yup.object({
  email: yup.string().required('Digite seu E-mail!').email('E-mail inválido!'),
  password: yup.string().required('Digite sua senha!'),
})

export function Login({ signInUser }) {
  
  const [errors, setErros] = useState();

  const formik = useFormik({
    onSubmit: async values =>{
      
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_HOST}/login`, {
          auth: {
            username: values.email,
            password: values.password,
          }
        })
        
        signInUser(res.data); 

      } catch (error) {
        if(error.response.status === 404) {
          setErros('Usuário ou senha inválidos!');
        }
      }
    },
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    validateOnMount: true,
  })

  return (
    <div className='h-full flex justify-center '>
      <div className='bg-birdBlue lg:flex-1'></div>
      <div className="flex-1 flex justify-center items-center">
        <div className='max-w-lg flex-1 flex flex-col p-12 space-y-6'>

          <h1 className="text-3xl">Acesse sua conta</h1>

          <form className="space-y-6" onSubmit={formik.handleSubmit}>

            <div className='space-y-2'>
              <Input
                type="text"
                name="email" 
                placeholder="E-mail"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}
              />
              {formik.touched.email && formik.errors.email && (
                <div className='text-red-500 text-sm'>{formik.errors.email}</div>
              )}
            </div>

            <div className='space-y-2'>
              <Input
                type="password"
                name="password" 
                placeholder="Senha"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}
              />
              {formik.touched.password && formik.errors.password && (
                <div className='text-red-500 text-sm'>{formik.errors.password}</div>
              )}
            </div>
            <div className='space-y-1'>
              <button
                type="submit"
                className="w-full bg-birdBlue py-4 rounded-full disabled:opacity-50 text-lg"
                disabled={formik.isSubmitting || !formik.isValid}
              >
                {formik.isSubmitting ?  'Enviando...' : 'Entrar'}
              </button>
              {errors && <div className='text-red-500 text-base text-center'>{errors}</div>}
            </div>
          </form>
          <span className="text-sm text-silver self-center">
            Não tem conta? <a className="text-birdBlue" href='/signup'>Inscreva-se</a>
          </span>
        </div>
      </div>
    </div>
  )
}