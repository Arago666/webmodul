<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    public function storeTask(Request $request)
    {
        Task::create([
            'title'         => $request->title,
            'date'          => $request->date,
            'time'          => $request->time,
            'detail'        => $request->detail,
        ]);

        return response()->json('Task stored successfully!');
    }
}
