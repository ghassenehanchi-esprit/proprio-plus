@extends('errors.error-layout')

@section('title', 'Page non trouvée')
@section('code', '404')
@section('message', 'La page demandée est introuvable.')

@section('image')
<svg xmlns="http://www.w3.org/2000/svg" class="mx-auto w-52 h-52 text-orange-500 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  <circle cx="11" cy="11" r="8" />
  <path d="M21 21l-4.35-4.35" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
@endsection
