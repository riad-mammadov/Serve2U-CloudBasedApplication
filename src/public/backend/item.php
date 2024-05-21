<?php

// For this page a tutorial was followed however the design was completely refined along with the functionality, but the core base of the
// cart.html page uses this tutorial to help as it was the first time implementing a payment system into a project 

// https://www.youtube.com/watch?v=LgnITjRQnlM

class Item
{
    public $id;
    public $name;
    public $price;
    public $image;
    public $category;

    function __construct($id, $name, $price, $image, $category)
    {
        $this->id = $id;
        $this->name = $name;
        $this->price = $price;
        $this->image = $image;
        $this->category = $category;
    }
}