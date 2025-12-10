<?php

/** @var \App\Model\Film $film */
/** @var \App\Service\Router $router */

$title = 'Create Film';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create Film</h1>

    <form action="<?= $router->generatePath('film-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . '/_form.html.php'; ?>
        <input type="hidden" name="action" value="film-create">
    </form>

    <a href="<?= $router->generatePath('film-index') ?>">Back to list</a>

<?php $main = ob_get_clean();

include __DIR__ . '/../base.html.php';
