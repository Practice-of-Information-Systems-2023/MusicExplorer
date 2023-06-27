import logging


def init_logger(level=logging.INFO):
    logger = logging.getLogger(__name__)
    logger.setLevel(level)
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler = logging.FileHandler('log.txt')
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    return logger