<?php

/** @var \App\Model\Film $film */
/** @var \App\Service\Router $router */

$title = "{$film->getTitle()} ({$film->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $film->getTitle() ?></h1>

    <article>
        <?= nl2br(htmlspecialchars($film->getDescription())) ?>
    </article>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('film-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('film-edit', ['id' => $film->getId()]) ?>">Edit</a></li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . '/../base.html.php';
