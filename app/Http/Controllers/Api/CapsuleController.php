<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use  App\Services\User\CapsuleService;
use Illuminate\Http\Request;

class CapsuleController extends Controller
{
        function getAllCapsules(){
        $tasks = CapsuleController::getAllCapsules();
        return $this->responseJSON($tasks);
    }

    // function addOrUpdateTask(Request $request, $id = null){
    //     $task = new Task;
    //     if($id){
    //         $task = TaskService::getAllTasks($id);
    //     }

    //     $task = TaskService::createOrUpdateTask($request, $task);
    //     return $this->responseJSON($task);
    // }
}
