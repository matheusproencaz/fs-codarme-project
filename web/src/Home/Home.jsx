
import { HeartIcon } from '@heroicons/react/outline';
import { FiHash, RiHome7Fill, BsTwitter, VscBell, AiOutlineMail, MdSaveAlt , CgList ,IoPersonOutline,  CgMoreO, BsPlusLg, FiSearch } from 'react-icons/all'
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import avatar from './avatar.png';

const MAX_TWEET_CHAR = 140;

function TweetNavbarItem({ text, className, children }){
  return(
    <div className='flex items-center justify-center lg:justify-start text-2xl '>
      {children}
      <div>
        <p className={`text-xl pl-4 hidden lg:flex ${className}`}>{text}</p>
      </div>
    </div>
  )
}

function TweetNavbar(){
  const [width, setWidth] = useState(window.innerWidth);

  const updateWidth = () => {
    setWidth(window.innerWidth);
  }
  
  useEffect(() => {
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  
  }, []);
  
  return(
    <div className="flex flex-col space-y-8 px-9">
      <BsTwitter className='text-2xl mt-4 self-center lg:self-start'/>
      
      <TweetNavbarItem text='Página Inicial' className="font-bold">
        <RiHome7Fill/>
      </TweetNavbarItem>

      <TweetNavbarItem text='Explorar'>
        <FiHash />
      </TweetNavbarItem>        

      <TweetNavbarItem text='Notificações'>
        <VscBell className=''/>
      </TweetNavbarItem>        

      <TweetNavbarItem text='Mensagens'>
        <AiOutlineMail className=''/>
      </TweetNavbarItem>        

      <TweetNavbarItem text='Items salvos'>
        <MdSaveAlt className=''/>
      </TweetNavbarItem>        

      <TweetNavbarItem text='Listas'>
        <CgList className=''/>
      </TweetNavbarItem>        

      <TweetNavbarItem text='Perfil'>
        <IoPersonOutline className=''/>
      </TweetNavbarItem>        

      <TweetNavbarItem text='Mais'>
        <CgMoreO className=''/>
      </TweetNavbarItem>        

      <button className='bg-birdBlue p-5 lg:px-20 lg:py-3 rounded-full  disabled:opacity-50'>
        {width > 1024 
          ? <p className='text-lg font-bold'>Tweetar</p>
          : <BsPlusLg />
        }
      </button> 
    </div>
  )
}

function TweetForm({ loggedInUser, onSuccess }){

  const formik = useFormik({
    onSubmit: async (values, form) => { 
      await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_API_HOST}/tweets`,
        headers: {
          'authorization': `Bearer ${loggedInUser.accessToken}`
        },
        data: {
          text: values.text
        },
      })

      form.setFieldValue('text', '')
      onSuccess();
    },
    initialValues: {
      text: ''
    }
  })

  return (
    <div className='border-b border-silver p-4 space-y-6'>
      <div className='flex space-x-5'>
        <h1 className='font-bold text-xl'>Página Inicial</h1>
      </div>
      
      <form className='text-lg flex flex-col' onSubmit={formik.handleSubmit}>
          
        <div className='flex space-x-5'>
          <img className='h-full' src={avatar}/>
          <textarea 
            name="text" 
            value={formik.values.text}
            className='bg-transparent outline-none disabled:opacity-50 w-full mt-3'
            placeholder="O que está acontecendo?"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
          /> 
        </div>
        
        <div className='flex justify-end items-center space-x-3'>
          <span className='text-sm '>
           <span>{formik.values.text.length}</span> / <span className='text-birdBlue'>{MAX_TWEET_CHAR}</span>
          </span>
          
          <button
            type='submit'
            className='bg-birdBlue px-5 py-2 rounded-full disabled:opacity-50'
            disabled={formik.values.text.length > MAX_TWEET_CHAR || formik.isSubmitting}
          >
            Tweetar
          </button>
        </div>
      </form>
    </div>
  )
}

function Tweet({name, username, avatar, children}){
  return (
    <div className="flex space-x-3 p-4 border-b border-silver">
      <div>
        <img src={avatar}/>
      </div>
      <div className='space-y-1'>
        <span className="font-bold text-sm">{name}</span> {' '}
        <span className="text-sm text-silver">@{username}</span>

        <p>
          {children}
        </p>
        <div className='flex space-x-1 text-silver text-sm items-center'>
          <HeartIcon className='w-6 stroke-1 '/>
          <span>1.2k</span>
        </div>
      </div>
    </div>
  )
}

function TweetMoments(){
  return(
    <div className='bg-onix w-full h-[557px] rounded-2xl opacity-80'>
      <p>Moments</p>
    </div>
  )
}

function TweetWhoToFollow(){
  return(
    <div className='bg-onix w-full h-[338px] rounded-2xl opacity-80'>
      <p>Who to follow</p>
    </div>
  )
}

export default function Home({ loggedInUser }){
  const [data, setData] = useState([]);

  async function getData(){
    const res = await axios.get(`${import.meta.env.VITE_API_HOST}/tweets`, {
      headers: {
        'authorization': `Bearer ${loggedInUser.accessToken}`
      }
    })
    setData(res.data);
  }

  useEffect(() => {
    getData()

    const input = document.getElementById('searchTwitter');
    const icon = document.getElementById('searchTwitterIcon');

    input.addEventListener('focusin', () => {
      icon.classList.remove("text-silver")
      icon.classList.add("text-birdBlue");
    })

    input.addEventListener('focusout', () => {
      icon.classList.remove("text-birdBlue");
      icon.classList.add("text-silver")
    })

  },[]);

  return(
    <div className='flex justify-center'>
      <TweetNavbar />

      <div className='max-w-[600px] border-silver border-x w-full mr-7'>
        <TweetForm loggedInUser={ loggedInUser } onSuccess={getData}/>
        <div>
          {data.length && data.map(tweet => (
            <Tweet name={tweet.user.name} username={tweet.user.username} avatar={avatar} key={tweet.id}>
            {tweet.text}
          </Tweet>
          ))}
        </div>
      </div>

      <div className='hidden lg:flex lg:flex-col lg:space-y-4 lg:max-w-[350px]'>
        <div 
        className='flex mt-[5px] pl-2 pr-11 items-center max-w-sm w-full bg-onix rounded-full py-[10px] focus-within:outline 
        outline-birdBlue outline-1 opacity-80'
        >
          <FiSearch id='searchTwitterIcon' className={`text-xl text-silver mx-3`}/>
          <input id='searchTwitter' className='bg-onix text-platinum placeholder:text-silver outline-none w-[16rem] ' type="text" placeholder='Buscar no Twitter'/>
        </div>
        <TweetMoments />
        <TweetWhoToFollow />
        <div className='px-5 text-xs'>
          <p >
            <a className='hover:underline' href="#">Termos de Serviço </a>
            <a className='hover:underline' href="#">Política de Privacidade </a>
            <br />
            <a className='hover:underline' href="#">Política de Cookies </a>
            <a className='hover:underline' href="#">Acessibilidade </a>
            <br />
            <a className='hover:underline' href="#">Informações de anúncios </a>
            <a className='hover:underline' href="#">Mais... </a>
            <br/>
            <a className='hover:underline' href="#">	&#169; Matheus Proença, Inc.</a>
          </p>
        </div>
      </div>
    </div>
  )
}