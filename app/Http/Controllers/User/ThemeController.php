<?php
namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ThemeController extends Controller
{
    public function update(Request $request)
    {
        $request->validate(['dark_mode' => 'boolean']);
        $user = $request->user();
        $user->dark_mode = $request->dark_mode;
        $user->save();
        return response()->json(['dark_mode' => $user->dark_mode]);
    }
}
