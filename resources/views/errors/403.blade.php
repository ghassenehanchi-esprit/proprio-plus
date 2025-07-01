@extends('errors.error-layout')

@section('title', 'Accès refusé')
@section('code', '403')
@section('message', "Désolé, vous n'avez pas accès à cette page.")

@section('image')
<svg xmlns="http://www.w3.org/2000/svg" class="mx-auto w-52 h-52 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  <rect x="3" y="11" width="18" height="10" rx="2"/>
  <path d="M7 11V7a5 5 0 0110 0v4"/>
</svg>
@endsection
