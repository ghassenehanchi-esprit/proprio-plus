@extends('errors.error-layout')

@section('title', 'Non implémenté')
@section('code', '501')
@section('message', "Cette fonctionnalité n'est pas encore disponible.")

@section('image')
<svg xmlns="http://www.w3.org/2000/svg" class="mx-auto w-52 h-52 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v3m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
@endsection
