import { useFormik } from 'formik';
import * as yup from 'yup';
import 'axios';
import axios from 'axios';
import { useState } from 'react';


const Input = props => (
  <input {...props} className="w-full bg-transparent p-4 border rounded-xl border-onix text-lg outline-none focus:border-platinium"/>
)

const validationSchema = yup.object({
  name: yup.string().required('Digite seu nome!'),
  username: yup.string().required('Digite seu nome de usuário!'),
  email: yup.string().required('Digite seu E-mail!').email('E-mail inválido!'),
  password: yup.string().required('Digite sua senha!'),
})

export function Signup({ signInUser }) {
  
  const [errors, setErrors] = useState();

  const formik = useFormik({
    onSubmit: async values =>{
    try {
      const res = await axios.post('http://localhost:9901/signup', {
          name: values.name,
          email: values.email,
          username: values.username,
          password: values.password,
      })
      signInUser(res.data);
    } catch (error) {
      
      if(error.response.status === 422){
        setErrors("Usuário já existe!");
        return
      }

      setErrors("Erro ao cadastrar usuário!");
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
    <div className="flex h-full flex-col justify-center p-12 space-y-6">
      <h1 className="text-3xl">Cadastre sua conta</h1>

      <form className="space-y-6" onSubmit={formik.handleSubmit}>
      
      <div className='space-y-2'>
          <Input
            type="text"
            name="name" 
            placeholder="Nome"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
          />
          {formik.touched.name && formik.errors.name && (
            <div className='text-red-500 text-sm'>{formik.errors.name}</div>
          )}
        </div>

        <div className='space-y-2'>
          <Input
            type="text"
            name="username" 
            placeholder="Nome de usuário"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
          />
          {formik.touched.username && formik.errors.username && (
            <div className='text-red-500 text-sm'>{formik.errors.username}</div>
          )}
        </div>

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
            {formik.isSubmitting ?  'Enviando...' : 'Cadastrar'}
          </button>
          {errors && <div className='text-red-500 text-base text-center'>{errors}</div>}
        </div>
      </form>
      <span className="text-sm text-silver text-center">
        Já tem uma conta? <a className="text-birdBlue" href='/login'>Acesse</a>
      </span>
    </div>
  )
}